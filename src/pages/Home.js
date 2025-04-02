import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setSelectedDates, setAssignedPosts } from "../store/calendarSlice";
import CalendarGrid from "../components/CalendarGrid";
import axios from "axios";
import ExcelExport from "../utils/excelExport";

const Home = () => {
    const dispatch = useDispatch();
    const { posts, selectedDates, assignedPosts } = useSelector((state) => state.calendar);

    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedCategories, setSelectedCategories] = useState([]); // 🔥 Track selected categories

    useEffect(() => {
        axios.get("/posts.json").then((response) => {
            dispatch(setPosts(response.data));
        });
    }, [dispatch]);

    const handleDateSelection = (date) => {
        let updatedDates = [...selectedDates];
        if (updatedDates.includes(date)) {
            updatedDates = updatedDates.filter((d) => d !== date);
        } else {
            updatedDates.push(date);
        }
        dispatch(setSelectedDates(updatedDates));

        if (updatedDates.length === 0) {
            axios.get("/posts.json").then((response) => {
                dispatch(setPosts(response.data));
                dispatch(setAssignedPosts([]));
            });
            return;
        }

        let sortedPosts = [...posts]
            .filter((post) => selectedCategories.length === 0 || selectedCategories.includes(post.category)) // 🔥 Filter by category
            .sort((a, b) => b.followerCount - a.followerCount);

        let assigned = sortedPosts.map((post, i) => ({ ...post, date: updatedDates[i % updatedDates.length] }));

        dispatch(setAssignedPosts(assigned));
    };

    const handleExport = () => {
        if (assignedPosts.length === 0) {
            alert("No posts available for export!");
            return;
        }
        ExcelExport(assignedPosts, selectedDates, selectedCategories);
        dispatch(setSelectedDates([]));
        setSelectedCategories([]); // 🔥 Reset categories after export
    };

    return (
        <div>
            <h1>Social Media Content Calendar</h1>
            <div>
                <label>Month: </label>
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {new Date(0, i, 1).toLocaleString("default", { month: "long" })}
                        </option>
                    ))}
                </select>

                <label>Year: </label>
                <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} min="2000" />
            </div>

            {/* 🔥 Category Selection UI */}
            <div>
                <label>Select Categories:</label>
                {Array.from(new Set(posts.map((post) => post.category))).map((category) => (
                    <label key={category}>
                        <input
                            type="checkbox"
                            value={category}
                            checked={selectedCategories.includes(category)}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedCategories((prev) =>
                                    prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
                                );
                            }}
                        />
                        {category}
                    </label>
                ))}
            </div>

            <CalendarGrid selectedDates={selectedDates} onSelectDate={handleDateSelection} month={month} year={year} />
            <button onClick={handleExport}>Export to Excel</button>
        </div>
    );
};

export default Home;
