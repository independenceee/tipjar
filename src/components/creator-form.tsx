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
                className="mx-auto w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <motion.div
                        className="mb-5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                    >
                        <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
                            Title
                        </label>
                        <input
                            {...register("title")}
                            type="text"
                            id="title"
                            placeholder="Enter your title"
                            className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 px-4 text-base text-gray-900 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                            disabled={isSubmitting}
                        />
                        {errors.title && (
                            <motion.p
                                className="text-red-500 text-sm mt-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {errors.title.message}
                            </motion.p>
                        )}
                    </motion.div>
                    <motion.div
                        className="mb-5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                    >
                        <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
                            Description
                        </label>
                        <textarea
                            {...register("description")}
                            id="description"
                            rows={4}
                            placeholder="Enter your description"
                            className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 px-4 text-base text-gray-900 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                            disabled={isSubmitting}
                        />
                        {errors.description && (
                            <motion.p
                                className="text-red-500 text-sm mt-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {errors.description.message}
                            </motion.p>
                        )}
                    </motion.div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.div
                            className="w-full sm:w-1/2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.7 }}
                        >
                            <label htmlFor="author" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
                                Author
                            </label>
                            <input
                                {...register("author")}
                                type="text"
                                id="author"
                                placeholder="Enter your author name"
                                className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 px-4 text-base text-gray-900 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                                disabled={isSubmitting}
                            />
                            {errors.author && (
                                <motion.p
                                    className="text-red-500 text-sm mt-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {errors.author.message}
                                </motion.p>
                            )}
                        </motion.div>
                        <motion.div
                            className="w-full sm:w-1/2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.8 }}
                        >
                            <label htmlFor="image" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
                                Image URL
                            </label>
                            <input
                                {...register("image")}
                                type="text"
                                id="image"
                                placeholder="Enter your image URL"
                                className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 px-4 text-base text-gray-900 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                                disabled={isSubmitting}
                            />
                            {errors.image && (
                                <motion.p
                                    className="text-red-500 text-sm mt-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {errors.image.message}
                                </motion.p>
                            )}
                        </motion.div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.div
                            className="w-full sm:w-1/2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.9 }}
                        >
                            <label htmlFor="startDate" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
                                Start Date
                            </label>
                            <input
                                {...register("startDate")}
                                type="date"
                                id="startDate"
                                className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 px-4 text-base text-gray-900 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                                disabled={isSubmitting}
                            />
                            {errors.startDate && (
                                <motion.p
                                    className="text-red-500 text-sm mt-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {errors.startDate.message}
                                </motion.p>
                            )}
                        </motion.div>
                        <motion.div
                            className="w-full sm:w-1/2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 1.0 }}
                        >
                            <label htmlFor="endDate" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
                                End Date
                            </label>
                            <input
                                {...register("endDate")}
                                type="date"
                                id="endDate"
                                className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 px-4 text-base text-gray-900 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                                disabled={isSubmitting}
                            />
                            {errors.endDate && (
                                <motion.p
                                    className="text-red-500 text-sm mt-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {errors.endDate.message}
                                </motion.p>
                            )}
                        </motion.div>
                    </div>
                    <motion.div
                        className="mb-5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 1.1 }}
                    >
                        <label htmlFor="participants" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
                            Max Participants
                        </label>
                        <input
                            {...register("participants", { valueAsNumber: true })}
                            type="number"
                            id="participants"
                            placeholder="Enter max number of participants"
                            min="1"
                            max="1000"
                            className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 px-4 text-base text-gray-900 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                            disabled={isSubmitting}
                        />
                        {errors.participants && (
                            <motion.p
                                className="text-red-500 text-sm mt-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {errors.participants.message}
                            </motion.p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 1.2 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-blue-600 dark:bg-white py-3 px-8 text-base font-semibold text-white dark:text-blue-900 shadow-xl hover:bg-blue-700 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? "Submitting..." : "Register"}
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        ),
    };
}
