const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const PORT = process.env.PORT || 4000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // eslint-disable-next-line no-console
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env (service key only on backend!)"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

const handleError = (res, error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  res.status(500).json({ error: error?.message || "Server error" });
};

const parseNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseDateToIso = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const parsePagination = (req) => {
  const page = Math.max(parseNumber(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseNumber(req.query.limit) || 20, 1), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const getBearerToken = (req) => {
  const authHeader = req.headers?.authorization || "";
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() === "bearer" && token) return token;
  return null;
};

const getUserFromRequest = async (req) => {
  const token = getBearerToken(req);
  if (!token) {
    return { user: null, error: new Error("Missing bearer token") };
  }
  const { data, error } = await supabase.auth.getUser(token);
  return { user: data?.user ?? null, error };
};

const fetchConflictingBookings = async (roomIds, startIso, endIso) => {
  return supabase
    .from("bookings")
    .select("id, room_id, user_email, status, start_time, end_time")
    .in("room_id", roomIds)
    .lt("start_time", endIso)
    .gt("end_time", startIso);
};
function generateAltSlots(startIso, endIso) {
  const durationMs = new Date(endIso).getTime() - new Date(startIso).getTime();

  const baseStart = new Date(startIso);
  const slots = [];

  for (let i = 1; i <= 3; i++) {
    const newStart = new Date(baseStart.getTime() + i * 60 * 60 * 1000);
    const newEnd = new Date(newStart.getTime() + durationMs);

    slots.push({
      startTime: newStart.toISOString(),
      endTime: newEnd.toISOString(),
      duration: `${durationMs / 60000} mins`,
    });
  }

  return slots;
}
async function suggestRooms(startIso, endIso, currentRoomId) {
  // 1. Get all rooms except the current one
  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .neq("id", currentRoomId);

  if (error || !rooms) return [];

  // 2. Check conflicts for those rooms
  const roomIds = rooms.map((r) => r.id);

  const conflictRes = await fetchConflictingBookings(roomIds, startIso, endIso);

  if (conflictRes.error) return [];

  const conflictedRoomIds = new Set(
    (conflictRes.data || []).map((b) => b.room_id)
  );

  // 3. Keep only free rooms
  return rooms.filter((room) => !conflictedRoomIds.has(room.id));
}

// Healthcheck + quick DB connectivity test
app.get("/health", async (_req, res) => {
  const { error } = await supabase.from("rooms").select("id").limit(1);
  if (error) return handleError(res, error);
  res.json({ ok: true });
});

// Auth signup (service role)
app.post("/auth/signup", async (req, res) => {
  const { email, password, full_name, role = "student" } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role },
  });
  if (error) return handleError(res, error);

  const userId = data?.user?.id;
  if (userId) {
    const { error: profileError } = await supabase.from("users").upsert({
      id: userId,
      email,
      full_name,
      role,
    });
    if (profileError) return handleError(res, profileError);
  }

  res.status(201).json({
    user: {
      id: userId,
      email,
      role,
      full_name,
    },
  });
});

// Current user profile (requires Bearer token from Supabase Auth)
const handleGetMe = async (req, res) => {
  const { user, error } = await getUserFromRequest(req);
  if (error || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data, error: profileError } = await supabase
    .from("users")
    .upsert(
      {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name,
        role: user.user_metadata?.role || "student",
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (profileError) return handleError(res, profileError);
  res.json(data);
};

const handlePatchMe = async (req, res) => {
  const { user, error } = await getUserFromRequest(req);
  if (error || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const updates = {};
  if (req.body?.full_name !== undefined) updates.full_name = req.body.full_name;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  updates.updated_at = new Date().toISOString();

  const { data, error: profileError } = await supabase
    .from("users")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (profileError) return handleError(res, profileError);
  res.json(data);
};

app.get("/profiles/me", handleGetMe);
app.patch("/profiles/me", handlePatchMe);
app.get("/users/me", handleGetMe);
app.patch("/users/me", handlePatchMe);

// Building list with floor & room counts
app.get("/buildings", async (_req, res) => {
  const { data, error } = await supabase
    .from("rooms")
    .select("id, building, floor");
  if (error) return handleError(res, error);

  const grouped = (data || []).reduce((acc, row) => {
    if (!acc[row.building]) {
      acc[row.building] = {
        building: row.building,
        totalRooms: 0,
        floors: new Set(),
      };
    }
    acc[row.building].totalRooms += 1;
    acc[row.building].floors.add(row.floor);
    return acc;
  }, {});

  const buildings = Object.values(grouped).map((item) => ({
    building: item.building,
    totalRooms: item.totalRooms,
    floors: Array.from(item.floors).sort((a, b) => a - b),
  }));

  res.json(buildings);
});

// Rooms list with filters, equipment, images, availability check
app.get("/rooms", async (req, res) => {
  const {
    search,
    building,
    status,
    capacityMin,
    capacityMax,
    equipment,
    availableStart,
    availableEnd,
  } = req.query;

  const { limit, offset, page } = parsePagination(req);

  let query = supabase
    .from("rooms")
    .select(
      "id, name, building, floor, room_number, capacity, status, image_url, door_status, device_status, occupancy_count, room_equipment(name,icon), room_images(url,alt)",
      { count: "exact" }
    )
    .order("name", { ascending: true })
    .range(offset, offset + limit - 1);

  if (building) query = query.ilike("building", `%${building}%`);
  if (status) query = query.eq("status", status);

  const minCap = parseNumber(capacityMin);
  const maxCap = parseNumber(capacityMax);
  if (minCap !== null) query = query.gte("capacity", minCap);
  if (maxCap !== null) query = query.lte("capacity", maxCap);

  const { data, error, count } = await query;
  if (error) return handleError(res, error);

  let rooms = data ?? [];

  if (search) {
    const term = search.toLowerCase();
    rooms = rooms.filter((room) => {
      return (
        room?.name?.toLowerCase().includes(term) ||
        room?.room_number?.toLowerCase?.()?.includes(term) ||
        room?.building?.toLowerCase().includes(term)
      );
    });
  }

  const requestedEquipment =
    typeof equipment === "string" && equipment.length
      ? equipment
          .split(",")
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean)
      : [];

  if (requestedEquipment.length > 0) {
    rooms = rooms.filter((room) => {
      const eqNames = (room?.room_equipment || []).map((e) =>
        (e?.name || "").toLowerCase()
      );
      return requestedEquipment.every((eq) =>
        eqNames.some((name) => name.includes(eq))
      );
    });
  }

  const startIso = parseDateToIso(availableStart);
  const endIso = parseDateToIso(availableEnd);
  let conflictsByRoom = {};

  if (startIso && endIso && rooms.length > 0) {
    const conflictRes = await fetchConflictingBookings(
      rooms.map((r) => r.id),
      startIso,
      endIso
    );
    if (conflictRes.error) return handleError(res, conflictRes.error);
    conflictsByRoom =
      conflictRes.data?.reduce((acc, booking) => {
        acc[booking.room_id] = acc[booking.room_id] || [];
        acc[booking.room_id].push(booking);
        return acc;
      }, {}) || {};
  }

  const enrichedRooms = rooms.map((room) => {
    if (!startIso || !endIso) return room;
    const conflicts = conflictsByRoom[room.id] || [];
    const nextAvailableAt =
      conflicts.length > 0
        ? new Date(
            Math.max(...conflicts.map((b) => new Date(b.end_time).getTime()))
          ).toISOString()
        : null;
    return {
      ...room,
      availability: {
        isAvailable: conflicts.length === 0,
        conflicts,
        nextAvailableAt,
      },
    };
  });

  res.json({
    total: count ?? enrichedRooms.length,
    page,
    limit,
    rooms: enrichedRooms,
  });
});

// Room detail + bookings + activity logs
app.get("/rooms/:id", async (req, res) => {
  const roomId = req.params.id;

  const [roomRes, bookingRes, activityRes] = await Promise.all([
    supabase
      .from("rooms")
      .select(
        "id, name, building, floor, room_number, capacity, status, image_url, area, climate, lighting, wing, nearest_entrance, latitude, longitude, door_status, device_status, occupancy_count, room_equipment(name,icon), room_images(url,alt)"
      )
      .eq("id", roomId)
      .single(),
    supabase
      .from("bookings")
      .select("id, room_id, user_email, status, start_time, end_time, purpose")
      .eq("room_id", roomId)
      .order("start_time", { ascending: true }),
    supabase
      .from("room_activity_logs")
      .select("id, room_id, action, by_user, details, success, created_at")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
      .limit(25),
  ]);

  if (roomRes.error) return handleError(res, roomRes.error);
  if (bookingRes.error) return handleError(res, bookingRes.error);
  if (activityRes.error) return handleError(res, activityRes.error);

  res.json({
    room: roomRes.data,
    bookings: bookingRes.data ?? [],
    activity_logs: activityRes.data ?? [],
  });
});

// Create room
app.post("/rooms", async (req, res) => {
  const {
    name,
    building,
    floor,
    room_number,
    capacity,
    status = "free",
    image_url,
    area,
    climate,
    lighting,
    wing,
    nearest_entrance,
    latitude,
    longitude,
    door_status = "locked",
    device_status = "off",
    occupancy_count = 0,
  } = req.body || {};

  if (
    !name ||
    !building ||
    !Number.isFinite(parseNumber(floor)) ||
    !Number.isFinite(parseNumber(capacity))
  ) {
    return res
      .status(400)
      .json({ error: "name, building, floor, capacity are required" });
  }

  const { data, error } = await supabase
    .from("rooms")
    .insert([
      {
        name,
        building,
        floor: parseNumber(floor),
        room_number,
        capacity: parseNumber(capacity),
        status,
        image_url,
        area,
        climate,
        lighting,
        wing,
        nearest_entrance,
        latitude: parseNumber(latitude),
        longitude: parseNumber(longitude),
        door_status,
        device_status,
        occupancy_count: parseNumber(occupancy_count) || 0,
      },
    ])
    .select()
    .single();

  if (error) return handleError(res, error);
  res.status(201).json(data);
});

// Update room metadata/status
app.patch("/rooms/:id", async (req, res) => {
  const roomId = req.params.id;
  const allowedFields = [
    "name",
    "building",
    "floor",
    "room_number",
    "capacity",
    "status",
    "image_url",
    "area",
    "climate",
    "lighting",
    "wing",
    "nearest_entrance",
    "latitude",
    "longitude",
    "door_status",
    "device_status",
    "occupancy_count",
  ];

  const updates = {};
  for (const key of allowedFields) {
    if (req.body?.[key] !== undefined) {
      if (
        [
          "floor",
          "capacity",
          "latitude",
          "longitude",
          "occupancy_count",
        ].includes(key)
      ) {
        const parsed = parseNumber(req.body[key]);
        if (!Number.isFinite(parsed)) continue;
        updates[key] = parsed;
      } else {
        updates[key] = req.body[key];
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  const { data, error } = await supabase
    .from("rooms")
    .update(updates)
    .eq("id", roomId)
    .select()
    .single();

  if (error) return handleError(res, error);
  res.json(data);
});

// Delete room (cascades to related tables)
app.delete("/rooms/:id", async (req, res) => {
  const roomId = req.params.id;
  const { error } = await supabase.from("rooms").delete().eq("id", roomId);
  if (error) return handleError(res, error);
  res.status(204).send();
});

// List bookings with optional filters
app.get("/bookings", async (req, res) => {
  const { room_id, user_email, status, upcoming } = req.query;
  const { limit, offset, page } = parsePagination(req);
  let query = supabase
    .from("bookings")
    .select("id, room_id, user_email, status, start_time, end_time, purpose", {
      count: "exact",
    })
    .order("start_time", { ascending: true })
    .range(offset, offset + limit - 1);

  if (room_id) query = query.eq("room_id", room_id);
  if (user_email) query = query.ilike("user_email", user_email);
  if (status) query = query.eq("status", status);
  if (upcoming === "true")
    query = query.gte("end_time", new Date().toISOString());

  const { data, error, count } = await query;
  if (error) return handleError(res, error);
  res.json({
    total: count ?? data?.length ?? 0,
    page,
    limit,
    bookings: data ?? [],
  });
});

// Check availability for a specific room/time window
app.post("/availability-check", async (req, res) => {
  const { room_id, start_time, end_time } = req.body || {};
  const startIso = parseDateToIso(start_time);
  const endIso = parseDateToIso(end_time);

  if (!room_id || !startIso || !endIso) {
    return res.status(400).json({
      error:
        "room_id, start_time, end_time are required and must be valid dates",
    });
  }
  if (new Date(startIso).getTime() >= new Date(endIso).getTime()) {
    return res
      .status(400)
      .json({ error: "start_time must be before end_time" });
  }

  const conflictRes = await fetchConflictingBookings(
    [room_id],
    startIso,
    endIso
  );
  if (conflictRes.error) return handleError(res, conflictRes.error);
  const conflicts = conflictRes.data || [];

  res.json({
    isAvailable: conflicts.length === 0,
    conflicts,
    alternativeSlots:
      conflicts.length > 0 ? generateAltSlots(startIso, endIso) : [],
    alternativeRooms:
      conflicts.length > 0 ? await suggestRooms(startIso, endIso, room_id) : [],
  });
});

// Create booking with overlap protection
app.post("/bookings", async (req, res) => {
  const {
    room_id,
    user_email,
    start_time,
    end_time,
    status = "reserved",
    purpose,
  } = req.body || {};

  const startIso = parseDateToIso(start_time);
  const endIso = parseDateToIso(end_time);

  if (!room_id || !user_email || !startIso || !endIso) {
    return res.status(400).json({
      error:
        "room_id, user_email, start_time, end_time are required and must be valid",
    });
  }

  if (new Date(startIso).getTime() >= new Date(endIso).getTime()) {
    return res
      .status(400)
      .json({ error: "start_time must be before end_time" });
  }

  const conflictRes = await fetchConflictingBookings(
    [room_id],
    startIso,
    endIso
  );
  if (conflictRes.error) return handleError(res, conflictRes.error);
  if (conflictRes.data && conflictRes.data.length > 0) {
    return res.status(409).json({
      error: "Time slot overlaps existing booking",
      conflicts: conflictRes.data,
    });
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        room_id,
        user_email,
        start_time: startIso,
        end_time: endIso,
        status,
        purpose,
      },
    ])
    .select()
    .single();

  if (error) return handleError(res, error);
  res.status(201).json(data);
});

// Update booking with overlap protection
app.patch("/bookings/:id", async (req, res) => {
  const bookingId = req.params.id;
  const { room_id, start_time, end_time, status, purpose } = req.body || {};

  const updates = {};
  if (room_id) updates.room_id = room_id;
  if (status) updates.status = status;
  if (purpose !== undefined) updates.purpose = purpose;

  const startIso = parseDateToIso(start_time);
  const endIso = parseDateToIso(end_time);
  if (start_time !== undefined) updates.start_time = startIso;
  if (end_time !== undefined) updates.end_time = endIso;

  if (start_time !== undefined || end_time !== undefined) {
    if (!startIso || !endIso) {
      return res
        .status(400)
        .json({ error: "start_time and end_time must be valid dates" });
    }
    if (new Date(startIso).getTime() >= new Date(endIso).getTime()) {
      return res
        .status(400)
        .json({ error: "start_time must be before end_time" });
    }
  }

  if (room_id || (startIso && endIso)) {
    const roomToCheck = room_id;
    const timeStart = startIso;
    const timeEnd = endIso;

    // Need existing booking for defaults
    const { data: existing, error: existingError } = await supabase
      .from("bookings")
      .select("id, room_id, start_time, end_time")
      .eq("id", bookingId)
      .single();
    if (existingError) return handleError(res, existingError);

    const checkRoom = roomToCheck || existing.room_id;
    const checkStart = timeStart || existing.start_time;
    const checkEnd = timeEnd || existing.end_time;

    const conflictRes = await fetchConflictingBookings(
      [checkRoom],
      checkStart,
      checkEnd
    );
    if (conflictRes.error) return handleError(res, conflictRes.error);
    const conflicts = (conflictRes.data || []).filter(
      (b) => b.id !== bookingId
    );
    if (conflicts.length > 0) {
      return res
        .status(409)
        .json({ error: "Time slot overlaps existing booking", conflicts });
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const { data, error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) return handleError(res, error);
  res.json(data);
});

// Delete booking
app.delete("/bookings/:id", async (req, res) => {
  const bookingId = req.params.id;
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);
  if (error) return handleError(res, error);
  res.status(204).send();
});

// Activity logs (list + create) and room control updates
app.get("/activity-logs", async (req, res) => {
  const { room_id, limit = 50 } = req.query;
  const { offset, page } = parsePagination(req);
  let query = supabase
    .from("room_activity_logs")
    .select("id, room_id, action, by_user, details, success, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(offset, offset + (parseNumber(limit) || 50) - 1);

  if (room_id) query = query.eq("room_id", room_id);

  const { data, error, count } = await query;
  if (error) return handleError(res, error);
  res.json({
    total: count ?? data?.length ?? 0,
    page,
    limit: parseNumber(limit) || 50,
    logs: data ?? [],
  });
});

app.post("/activity-logs", async (req, res) => {
  const { room_id, action, by_user, details, success = true } = req.body || {};
  if (!room_id || !action || !by_user) {
    return res
      .status(400)
      .json({ error: "room_id, action, by_user are required" });
  }
  const { data, error } = await supabase
    .from("room_activity_logs")
    .insert([{ room_id, action, by_user, details, success }])
    .select()
    .single();
  if (error) return handleError(res, error);
  res.status(201).json(data);
});

// Update room operational state (door/device/occupancy/status)
app.post("/rooms/:id/control", async (req, res) => {
  const roomId = req.params.id;
  const {
    door_status,
    device_status,
    occupancy_count,
    status,
    action,
    by_user,
  } = req.body || {};

  const updates = {};
  if (door_status) updates.door_status = door_status;
  if (device_status) updates.device_status = device_status;
  if (Number.isFinite(occupancy_count))
    updates.occupancy_count = occupancy_count;
  if (status) updates.status = status;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      error:
        "At least one of door_status, device_status, occupancy_count, status is required",
    });
  }

  const { data: room, error } = await supabase
    .from("rooms")
    .update(updates)
    .eq("id", roomId)
    .select()
    .single();
  if (error) return handleError(res, error);

  if (action && by_user) {
    await supabase.from("room_activity_logs").insert([
      {
        room_id: roomId,
        action,
        by_user,
        details: { updates },
        success: true,
      },
    ]);
  }

  res.json(room);
});
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    path: req.originalUrl,
  });
});

app.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${PORT}`)
);
