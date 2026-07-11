import { Request, Response } from "express";
import { PrismaClient, DesignStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const createDesign = async (req: Request, res: Response) => {
  try {
    const { status, config } = req.body;
    
    // Determine expiration date if it's for the cart (3 days)
    let expiresAt: Date | null = null;
    if (status === "CART") {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 3);
    }

    const design = await prisma.cardDesign.create({
      data: {
        status: status || DesignStatus.TEMPORARY,
        productName: config.productName,
        basePrice: config.basePrice,
        customBgPrice: config.customBgPrice,
        totalPrice: config.totalPrice,
        foilColor: config.foilColor,
        foilLabel: config.foilLabel,
        accentColor: config.accentColor,
        bgColor: config.bgColor,
        bgImage: config.bgImage,
        displayName: config.displayName,
        designation: config.designation,
        email: config.email,
        phone: config.phone,
        website: config.website,
        fontStyle: config.fontStyle,
        expiresAt,
      },
    });

    res.status(201).json({ success: true, design });
  } catch (error) {
    console.error("Error creating design:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getDesign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const design = await prisma.cardDesign.findUnique({
      where: { id },
    });

    if (!design) {
      return res.status(404).json({ success: false, message: "Design not found" });
    }

    // Soft delete check: If it's a cart item and expired, don't return it
    if (design.status === "CART" && design.expiresAt && new Date() > design.expiresAt) {
      return res.status(404).json({ success: false, message: "Design expired" });
    }

    res.status(200).json({ success: true, design });
  } catch (error) {
    console.error("Error fetching design:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
