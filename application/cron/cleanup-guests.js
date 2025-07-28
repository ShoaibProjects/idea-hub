import User from "../models/User";

async function deleteOldGuestUsers() {
    console.log("Running Vercel Cron Job: Deleting old guest users...");
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await User.deleteMany({
        username: { $regex: /^guest_/ },
        createdAt: { $lt: twentyFourHoursAgo },
    });

    if (result.deletedCount > 0) {
        console.log(`Cleanup successful: Deleted ${result.deletedCount} old guest user(s).`);
    } else {
        console.log("No old guest users to delete.");
    }

    return result;
}

export default async function handler(request, response) {
    if (request.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return response.status(401).json({ error: "Unauthorized" });
    }

    try {
        const result = await deleteOldGuestUsers();
        response.status(200).json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
        console.error("Error during guest user cleanup:", error);
        response.status(500).json({ success: false, error: "Internal Server Error" });
    }
}