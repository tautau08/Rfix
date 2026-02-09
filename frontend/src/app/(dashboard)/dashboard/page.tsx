"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-500 mt-1">
                    Here&apos;s what&apos;s happening in your workspace today.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Open Issues", value: "—", color: "from-blue-500 to-blue-600" },
                    { label: "In Progress", value: "—", color: "from-amber-500 to-amber-600" },
                    { label: "Resolved", value: "—", color: "from-green-500 to-green-600" },
                    { label: "Total Issues", value: "—", color: "from-primary to-pink-500" },
                ].map((card) => (
                    <div
                        key={card.label}
                        className="bg-white rounded-xl shadow-card p-5 border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <p className="text-sm text-gray-500 mb-2">{card.label}</p>
                        <div className="flex items-end justify-between">
                            <span className="text-3xl font-bold text-gray-900">
                                {card.value}
                            </span>
                            <div
                                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}
                            >
                                <div className="w-5 h-5 rounded-full bg-white/30"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                </h2>
                <div className="flex items-center justify-center py-12 text-gray-400">
                    <p className="text-sm">No recent activity to display.</p>
                </div>
            </div>
        </div>
    );
}
