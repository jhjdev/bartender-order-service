import express from 'express';
import { getSettings, updateSettings } from '../models/settings';
import {
  defaultTaxSettings,
  defaultLoyaltySettings,
  defaultOrderSettings,
  defaultOrderStatusSettings,
  defaultPaymentSettings,
  defaultTableSettings,
  defaultNotificationSettings,
} from '../types/settings';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    let settings = await getSettings();

    if (!settings) {
      settings = await updateSettings({
        taxSettings: defaultTaxSettings,
        loyaltySettings: defaultLoyaltySettings,
        orderSettings: defaultOrderSettings,
        orderStatusSettings: defaultOrderStatusSettings,
        paymentSettings: defaultPaymentSettings,
        tableSettings: defaultTableSettings,
        notificationSettings: defaultNotificationSettings,
        timestamps: {
          created: new Date(),
          updated: new Date(),
        },
      });
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/', async (req, res) => {
  try {
    const {
      taxSettings,
      loyaltySettings,
      orderSettings,
      orderStatusSettings,
      paymentSettings,
      tableSettings,
      notificationSettings,
    } = req.body;

    const existingSettings = await getSettings();
    const createdTimestamp =
      existingSettings?.timestamps?.created || new Date();

    const settings = await updateSettings({
      taxSettings,
      loyaltySettings,
      orderSettings,
      orderStatusSettings,
      paymentSettings,
      tableSettings,
      notificationSettings,
      timestamps: {
        created: createdTimestamp,
        updated: new Date(),
      },
    });

    res.status(200).json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
