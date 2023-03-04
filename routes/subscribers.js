const express = require("express");
const baseCount = 20;

const router = express.Router();

const Subscriber = require("../models/subscriber");

// Getting list
router.get("/", getListSubscriber, (req, res) => {
  // console.log("res", res.results);
  // console.log("query: " + JSON.stringify(req.query));
  // try {
  //   const subscribers = await Subscriber.find();
  //   res.json({
  //     data: subscribers,
  //     message: "Get all subscribers successfully",
  //     code: 200,
  //   });
  // } catch (err) {
  //   res.status(500).json({ message: err.message });
  // }
});

// Getting One
router.get("/:id", getSubscriber, (req, res) => {
  res.send(res.subscriber);
});

// Creating one
router.post("/", async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel,
  });
  try {
    const newSubscriber = await subscriber.save();
    res.status(201).json(newSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating one
router.patch("/:id", updateSubscriber, async (req, res) => {
  res.status(200).json({ message: "Updated Subscriber successfully" });
});

// Deleting one
router.delete("/:id", delSubscriber, async (req, res) => {
  res.status(200).json({ message: "Deleted Subscriber successfully" });
});

async function getSubscriber(req, res, next) {
  var subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id);
    if (subscriber == null) {
      return res.status(404).json({ message: "Cannot find subscriber" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.subscriber = subscriber;
  next();
}

async function delSubscriber(req, res, next) {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  next();
}

async function updateSubscriber(req, res, next) {
  try {
    await Subscriber.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      subscribedToChannel: req.body.subscribedToChannel,
      email: req.body.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  next();
}
async function getListSubscriber(req, res, next) {
  let subscribers;
  try {
    if (req.query?.sort_by && req.query?.sort) {
      subscribers = await Subscriber.find(
        {
          $or: [
            req.query?.name
              ? {
                  name: {
                    $regex: req.query?.name || undefined,
                    $options: req.query?.name ? "i" : undefined,
                  },
                }
              : {},
            req.query?.email
              ? {
                  email: {
                    $regex: req.query?.email || undefined,
                    $options: req.query?.email ? "i" : undefined,
                  },
                }
              : {},
            req.query?.subscribedToChannel
              ? {
                  subscribedToChannel: {
                    $regex: req.query?.subscribedToChannel || undefined,
                    $options: req.query?.subscribedToChannel ? "i" : undefined,
                  },
                }
              : {},
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
      // console.log("req.query?.name", req.query?.name);
      subscribers = await Subscriber.find(
        {
          $or: [
            req.query?.name
              ? {
                  name: {
                    $regex: req.query?.name || undefined,
                    $options: req.query?.name ? "i" : undefined,
                  },
                }
              : {},
            req.query?.email
              ? {
                  email: {
                    $regex: req.query?.email || undefined,
                    $options: req.query?.email ? "i" : undefined,
                  },
                }
              : {},
            req.query?.subscribedToChannel
              ? {
                  subscribedToChannel: {
                    $regex: req.query?.subscribedToChannel || undefined,
                    $options: req.query?.subscribedToChannel ? "i" : undefined,
                  },
                }
              : {},
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
    results: subscribers,
  });
  next();
}

module.exports = router;
