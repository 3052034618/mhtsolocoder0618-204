import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import Home from "@/pages/Home";
import CourseList from "@/pages/CourseList";
import CourseDetail from "@/pages/CourseDetail";
import WorkshopDetail from "@/pages/WorkshopDetail";
import UserCenter from "@/pages/UserCenter";
import UserBookings from "@/pages/UserBookings";
import UserWorks from "@/pages/UserWorks";
import UserReviews from "@/pages/UserReviews";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminCourses from "@/pages/AdminCourses";
import AdminSessions from "@/pages/AdminSessions";
import AdminCheckin from "@/pages/AdminCheckin";
import AdminSeries from "@/pages/AdminSeries";
import AdminTeam from "@/pages/AdminTeam";
import TeamBooking from "@/pages/TeamBooking";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { useCourseStore } from "@/store/useCourseStore";

export default function App() {
  const loadMockData = useCourseStore((state) => state.loadMockData);

  useEffect(() => {
    loadMockData();
  }, [loadMockData]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-sand-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/workshops/:id" element={<WorkshopDetail />} />
            <Route path="/user" element={<UserCenter />} />
            <Route path="/user/bookings" element={<UserBookings />} />
            <Route path="/user/works" element={<UserWorks />} />
            <Route path="/user/reviews" element={<UserReviews />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/sessions" element={<AdminSessions />} />
            <Route path="/admin/checkin" element={<AdminCheckin />} />
            <Route path="/admin/series" element={<AdminSeries />} />
            <Route path="/admin/team" element={<AdminTeam />} />
            <Route path="/team-booking" element={<TeamBooking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
        <MobileNav />
      </div>
    </Router>
  );
}
