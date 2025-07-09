"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function UserProfile() {
    const data = useQuery(api.members.getMemberInfo);
    console.log(data);
    return (
        <div>
            {data? (
                <div>
                    <h6>email: {data.user!.email}</h6>
                </div>
            ) : "No user found"}
        </div>
    );
}