import { Suspense } from 'react';
import Skeleton from "@mui/material/Skeleton";
import Footer from "@/components/Footer/Footer";
import AppBarMenuController from "@/controllers/appBarMenu";
import MainController from '@/controllers/main';
import { COLORS } from "@/theme/colors";

export default function Home() {
  return (
    <div
      className="flex flex-col w-full min-h-screen"
      style={{
        backgroundColor: COLORS.primary_background,
        color: COLORS.third_background_text,
        fontFamily: "sans-serif",
      }}
    >
      <Suspense fallback={<Skeleton width="100%" animation="wave" variant="rounded" />}>
        <AppBarMenuController />
      </Suspense>
      <main className="flex flex-col flex-1 w-full items-center justify-center overflow-auto">
        <Suspense fallback={<Skeleton width="100%" animation="wave" variant="rounded" />}>
          <MainController />
        </Suspense>
      </main>
      <footer className="flex flex-wrap items-center justify-center">
        <Footer />
      </footer>
    </div>
  );
}
