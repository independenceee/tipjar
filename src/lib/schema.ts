import { z } from "zod";

/**
 * Schema for creating a new "Creator" entity.
 *
 * Validations:
 * - `title`: Required string (1–100 chars).
 * - `description`: Required string (1–500 chars).
 * - `author`: Required string (1–50 chars).
 * - `image`: Optional URL or empty string.
 * - `startDate` and `endDate`: Must follow `YYYY-MM-DD` format.
 * - Ensures `endDate >= startDate`.
 * - `participants`: Number between 2 and 1000.
 * - `adaCommit`: Nested commit schema with txHash, outputIndex, and amount ≥ 10 ADA.
 */
export const CreatorSchema = z
    .object({
        title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
        description: z.string().min(1, "Description is required").max(500, "Description must be 500 characters or less"),
        author: z.string().min(1, "Author is required").max(50, "Author must be 50 characters or less"),
        image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
        participants: z.number().min(2, "At least 2 participant is required").max(1000, "Participants cannot exceed 1000"),
        adaCommit: z
            .object({
                txHash: z.string().min(1, "Transaction hash is required"),
                outputIndex: z.number().min(0, "Output index must be non-negative"),
                amount: z.number().min(10000000, "Must commit at least 10 ADA"),
            })
            .required({ txHash: true, outputIndex: true, amount: true }),
    })
    .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
        message: "End date must be after start date",
        path: ["endDate"],
    });

/**
 * Schema for a commit transaction.
 *
 * Ensures that:
 * - `txHash` is a non-empty string.
 * - `outputIndex` is a non-negative number.
 * - `amount` is at least 10 ADA (10,000,000 lovelace).
 */
export const CommitSchema = z
    .object({
        txHash: z.string().min(1, "Transaction hash is required"),
        outputIndex: z.number().min(0, "Output index must be non-negative"),
        amount: z.number().min(10000000, "Must commit at least 10 ADA"),
    })
    .required({ txHash: true, outputIndex: true, amount: true });

/**
 * Schema for tipping.
 *
 * Ensures that:
 * - `amount` must be at least 2 ADA.
 */
export const TipSchema = z.object({
    amount: z.number().min(2, "Must commit at least 2 ADA"),
});
