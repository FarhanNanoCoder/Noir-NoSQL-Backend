const express = require("express");
const baseCount = 20;

const router = express.Router();

const Channel = require("../models/product");

// Getting list
router.get("/", getListChannel, (req, res) => {
});

// Getting One
router.get("/:id", getChannel, (req, res) => {
  res.send(res.channel);
});

// Creating one
router.post("/", async (req, res) => {
  const channel = new Channel({
    name: req.body.name,
    type: req.body.type,
  });
  try {
    const newChannel = await channel.save();
    res.status(201).json(newChannel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating one
router.patch("/:id", updateChannel, async (req, res) => {
  res.status(200).json({ message: "Updated Channel successfully" });
});

// Deleting one
router.delete("/:id", delChannel, async (req, res) => {
  res.status(200).json({ message: "Deleted Channel successfully" });
});

async function getChannel(req, res, next) {
  var channel;
  try {
    channel = await Channel.findById(req.params.id);
    if (channel == null) {
      return res.status(404).json({ message: "Cannot find channel" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.channel = channel;
  next();
}

async function delChannel(req, res, next) {
  try {
    await Channel.findByIdAndDelete(req.params.id);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  next();
}

async function updateChannel(req, res, next) {
  try {
    await Channel.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      type: req.body.type,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  next();
}
async function getListChannel(req, res, next) {
  let channels;
  try {
    if (req.query?.sort_by && req.query?.sort) {
      channels = await Channel.find(
        {
          $or: [
            req.query?.name ? {
              name: {
                $regex: req.query?.name || undefined,
                $options: req.query?.name ? "i" : undefined,
              },
            }:{},
           
            req.query?.type ? {
              type: {
                $regex: req.query?.type || undefined,
                $options: req.query?.type ? "i" : undefined,
              },
            }:{},
          ],
        },
        {},
        {
          limit: req?.query?.count ?? baseCount,
          skip:
            ((parseInt(req?.query?.page) ?? 1) - 1) *
            (req?.query?.count ?? baseCount),
        }
      ).sort({ [req.query?.sort_by]: req.query?.sort ?? "asc" });
    } else {
      console.log("req.query?.name", req.query?.name);
      channels = await Channel.find(
        {
          $or: [
            req.query?.name ? {
              name: {
                $regex: req.query?.name || undefined,
                $options: req.query?.name ? "i" : undefined,
              },
            }:{},
            req.query?.type ? {
              type: {
                $regex: req.query?.type || undefined,
                $options: req.query?.type ? "i" : undefined,
              },
            }:{},
          ],
        },
        {},
        {
          limit: req?.query?.count ?? baseCount,
          skip:
            ((parseInt(req?.query?.page) ?? 1) - 1) *
            (req?.query?.count ?? baseCount),
        }
      ).sort({ createdAt: -1 ?? "asc" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  res.json({
    results: channels,
  });
  next();
}

module.exports = router;
