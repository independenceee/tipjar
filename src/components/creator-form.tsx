"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "~/hooks/use-wallet";
import { signup, submitTx } from "~/services/mesh.service";
import { CreatorSchema } from "~/lib/schema";
import { z } from "zod";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

type Form = z.infer<typeof CreatorSchema>;

export default function CreatorForm({ setLoading }: { setLoading: (loading: boolean) => void }) {
    const { address, signTx } = useWallet();
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<Form>({
        resolver: zodResolver(CreatorSchema),
        defaultValues: {
            title: "",
            description: "",
            author: "",
            image: "",
            startDate: "",
            endDate: "",
            participants: 2,
        },
    });

    const formValues = watch();

    const onSubmit = useCallback(
        async (data: Form) => {
            try {
                setLoading(true);
                const unsignedTx = await signup({
                    walletAddress: address as string,
                    assetName: data.author,
                    metadata: { ...data },
                });

                const signedTx = await signTx(unsignedTx as string);
                await submitTx({ signedTx });
                await queryClient.invalidateQueries({ queryKey: ["creator", address] });
            } catch (error) {
                console.error("TxSignError:", error);
            } finally {
                setLoading(false);
            }
        },
        [address, signTx, queryClient, setLoading],
    );

    return {
        formValues,
        form: (
            <motion.div
                className="w-full max-w-2xl mx-auto rounded-xl h-full bg-white dark:bg-slate-900/50 p-6 shadow-md shadow-blue-200/30 dark:shadow-blue-900/30 border-l-4 border-blue-500 dark:border-blue-600"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <label
                            htmlFor="title"
                            className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                        >
                            Title
                        </label>
                        <input
                            {...register("title")}
                            type="text"
                            id="title"
                            placeholder="Enter your title"
                            className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                            disabled={isSubmitting}
                        />
                        {errors.title && (
                            <motion.p
                                className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                            >
                                {errors.title.message}
                            </motion.p>
                        )}
                    </motion.div>
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <label
                            htmlFor="description"
                            className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                        >
                            Description
                        </label>
                        <textarea
                            {...register("description")}
                            id="description"
                            rows={4}
                            placeholder="Enter your description"
                            className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                            disabled={isSubmitting}
                        />
                        {errors.description && (
                            <motion.p
                                className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                            >
                                {errors.description.message}
                            </motion.p>
                        )}
                    </motion.div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.div
                            className="relative w-full sm:w-1/2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                        >
                            <label
                                htmlFor="author"
                                className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                            >
                                Author
                            </label>
                            <input
                                {...register("author")}
                                type="text"
                                id="author"
                                placeholder="Enter your author name"
                                className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                                disabled={isSubmitting}
                            />
                            {errors.author && (
                                <motion.p
                                    className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                                >
                                    {errors.author.message}
                                </motion.p>
                            )}
                        </motion.div>
                        <motion.div
                            className="relative w-full sm:w-1/2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                        >
                            <label
                                htmlFor="image"
                                className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                            >
                                Image URL
                            </label>
                            <input
                                {...register("image")}
                                type="text"
                                id="image"
                                placeholder="Enter your image URL"
                                className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                                disabled={isSubmitting}
                            />
                            {errors.image && (
                                <motion.p
                                    className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                                >
                                    {errors.image.message}
                                </motion.p>
                            )}
                        </motion.div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.div
                            className="relative w-full sm:w-1/2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.6 }}
                        >
                            <label
                                htmlFor="startDate"
                                className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                            >
                                Start Date
                            </label>
                            <input
                                {...register("startDate")}
                                type="date"
                                id="startDate"
                                className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                                disabled={isSubmitting}
                            />
                            {errors.startDate && (
                                <motion.p
                                    className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                                >
                                    {errors.startDate.message}
                                </motion.p>
                            )}
                        </motion.div>
                        <motion.div
                            className="relative w-full sm:w-1/2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.7 }}
                        >
                            <label
                                htmlFor="endDate"
                                className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                            >
                                End Date
                            </label>
                            <input
                                {...register("endDate")}
                                type="date"
                                id="endDate"
                                className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                                disabled={isSubmitting}
                            />
                            {errors.endDate && (
                                <motion.p
                                    className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                                >
                                    {errors.endDate.message}
                                </motion.p>
                            )}
                        </motion.div>
                    </div>
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 }}
                    >
                        <label
                            htmlFor="participants"
                            className="absolute rounded-xl z-10 -top-2 left-3 bg-white dark:bg-slate-900/50 px-1 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all"
                        >
                            Max Participants
                        </label>
                        <input
                            {...register("participants", { valueAsNumber: true })}
                            type="number"
                            id="participants"
                            placeholder="Enter max number of participants"
                            min="1"
                            max="1000"
                            className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50"
                            disabled={isSubmitting}
                        />
                        {errors.participants && (
                            <motion.p
                                className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.2, type: "spring", stiffness: 100 }}
                            >
                                {errors.participants.message}
                            </motion.p>
                        )}
                    </motion.div>
                    <motion.div
                        className="bg-white dark:bg-slate-900/50 pt-4 -mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-md bg-blue-500 dark:bg-blue-600 py-3 px-8 text-base font-semibold text-white dark:text-white shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? "Submitting..." : "Register"}
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        ),
    };
}
