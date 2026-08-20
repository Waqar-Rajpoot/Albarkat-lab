// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { Bone, FlaskConical } from "lucide-react";
// import { auth } from "@/lib/auth";

// export default async function AdminPage() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session) {
//     redirect("/sign-in");
//   }

//   if (session.user.role !== "admin") {
//     redirect("/");
//   }

//   return (
//     <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10 sm:py-16">
//       <h1 className="text-xl font-semibold text-text">Admin panel</h1>

//       <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
//         <p className="text-sm text-text-secondary">Signed in as</p>
//         <p className="font-medium text-text">{session.user.name}</p>
//         <p className="text-sm text-text-secondary">{session.user.email}</p>
//         <p className="mt-2 inline-block rounded bg-background-light px-2 py-0.5 text-xs font-medium text-text">
//           {session.user.role}
//         </p>
//       </div>

//       {/* Build out user management, etc. here */}
//       <div className="grid gap-3 sm:grid-cols-2">
//         <Link
//           href="/admin/xrays"
//           className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm transition hover:border-primary-light"
//         >
//           <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
//             <Bone className="h-5 w-5" />
//           </span>
//           <div>
//             <p className="font-medium text-text">X-Ray Procedures</p>
//             <p className="text-sm text-text-secondary">Manage the procedure list</p>
//           </div>
//         </Link>
//         <Link
//           href="/admin/tests"
//           className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm transition hover:border-primary-light"
//         >
//           <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
//             <FlaskConical className="h-5 w-5" />
//           </span>
//           <div>
//             <p className="font-medium text-text">Lab Tests</p>
//             <p className="text-sm text-text-secondary">Manage the test list</p>
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// }











// app/admin/page.tsx
//
// Admin Home / Dashboard — fully automatic, built against your real models.
//
// Data sources confirmed from the repo:
// - Test, XRay, Package → Mongoose models, connected via lib/mongodb.ts
//   These are CATALOG items (price list), not booking records — there is
//   no Booking/HomeSampling model, so these stats show what you currently
//   OFFER, not how many bookings happened (bookings go via WhatsApp,
//   handled manually per your earlier note).
// - Users → Better Auth's own `user` collection (native MongoDB driver),
//   read via lib/mongodb-native.ts. Includes the `role` field you added
//   in lib/auth.ts (defaults to "user").
//
// ⚠️ One assumption left: the Users admin page route. I've used
// `/admin/users` below — change ADMIN_ROUTES.users if yours differs.

import Link from "next/link";
import {
  FlaskConical,
  Scan,
  PackageCheck,
  Users,
  ArrowRight,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { connectToDatabase } from "@/lib/mongodb";
import { getNativeDb } from "@/lib/mongodb-native";
import Test from "@/models/Test";
import XRay from "@/models/XRay";
import Package from "@/models/Package";

export const dynamic = "force-dynamic"; // always fresh, never cached

const ADMIN_ROUTES = {
  tests: "/admin/tests",
  xrays: "/admin/xrays",
  packages: "/admin/packages",
  users: "/admin/users", // ⚠️ confirm this matches your actual route
};

async function getDashboardData() {
  await connectToDatabase();
  const nativeDb = await getNativeDb();
  const userCollection = nativeDb.collection("user");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    testTotal,
    testThisWeek,
    xrayTotal,
    xrayThisWeek,
    packageTotal,
    packageFeatured,
    userTotal,
    adminCount,
    recentTests,
    recentXRays,
    recentPackages,
  ] = await Promise.all([
    Test.countDocuments(),
    Test.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    XRay.countDocuments(),
    XRay.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Package.countDocuments(),
    Package.countDocuments({ isFeatured: true }),
    userCollection.countDocuments(),
    userCollection.countDocuments({ role: "admin" }),
    Test.find().sort({ createdAt: -1 }).limit(5).lean(),
    XRay.find().sort({ createdAt: -1 }).limit(5).lean(),
    Package.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const stats = [
    {
      key: "tests",
      label: "Tests",
      href: ADMIN_ROUTES.tests,
      icon: FlaskConical,
      total: testTotal,
      sub: `+${testThisWeek} this week`,
    },
    {
      key: "xrays",
      label: "X-Rays",
      href: ADMIN_ROUTES.xrays,
      icon: Scan,
      total: xrayTotal,
      sub: `+${xrayThisWeek} this week`,
    },
    {
      key: "packages",
      label: "Packages",
      href: ADMIN_ROUTES.packages,
      icon: PackageCheck,
      total: packageTotal,
      sub: `${packageFeatured} featured`,
    },
    {
      key: "users",
      label: "Users",
      href: ADMIN_ROUTES.users,
      icon: Users,
      total: userTotal,
      sub: `${adminCount} admin${adminCount === 1 ? "" : "s"} · ${
        userTotal - adminCount
      } regular`,
    },
  ];

  // Recent activity: newest catalog additions across Tests, X-Rays, Packages.
  const recentActivity = [
    ...recentTests.map((doc: any) => ({
      type: "Test",
      id: doc._id.toString(),
      title: doc.description,
      createdAt: doc.createdAt,
    })),
    ...recentXRays.map((doc: any) => ({
      type: "X-Ray",
      id: doc._id.toString(),
      title: `${doc.procedure} (${doc.category})`,
      createdAt: doc.createdAt,
    })),
    ...recentPackages.map((doc: any) => ({
      type: "Package",
      id: doc._id.toString(),
      title: doc.title,
      createdAt: doc.createdAt,
      featured: doc.isFeatured,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return { stats, recentActivity };
}

export default async function AdminHomePage() {
  const { stats, recentActivity } = await getDashboardData();

  return (
    <div className="min-h-screen bg-gray-200 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            What you currently offer, at a glance.
          </p>
        </div>

        {/* Stat cards — auto-updating counts from your catalog + users */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ key, label, href, icon: Icon, total, sub }) => (
            <Link key={key} href={href}>
              <Card className="border-gray-200 bg-white transition hover:border-gray-300 hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-gray-900">{total}</div>
                  <p className="mt-1 text-xs text-gray-500">{sub}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Quick links to other admin pages */}
          <Card className="border-gray-200 bg-white lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base font-medium text-gray-900">
                Manage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { label: "Tests", href: ADMIN_ROUTES.tests, icon: FlaskConical },
                { label: "X-Rays", href: ADMIN_ROUTES.xrays, icon: Scan },
                { label: "Packages", href: ADMIN_ROUTES.packages, icon: PackageCheck },
                { label: "Users", href: ADMIN_ROUTES.users, icon: Users },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-400" />
                    {label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-300" />
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent activity — newest catalog additions, auto-populated */}
          <Card className="border-gray-200 bg-white lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-medium text-gray-900">
                Recently Added
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-gray-400">Nothing yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentActivity.map((item: any) => (
                    <li
                      key={`${item.type}-${item.id}`}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {item.title}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                          {item.type}
                        </span>
                        {"featured" in item && item.featured && (
                          <Star className="h-3 w-3 fill-gray-400 text-gray-400" />
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}