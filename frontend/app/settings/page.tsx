import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function SettingsPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1">
        <Header />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">
            Settings
          </h1>

          <div className="border rounded-lg p-6">
            <p className="text-muted-foreground">
              OmniForge settings will appear here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}