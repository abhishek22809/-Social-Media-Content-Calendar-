import * as XLSX from "xlsx";

const ExcelExport = (posts, selectedDates, selectedCategories) => {
    if (!posts.length) {
        alert("No posts available for export!");
        return;
    }

    // Filter posts based on selected categories and dates
    let filteredPosts = posts.filter(
        (post) => selectedDates.includes(post.date) && selectedCategories.includes(post.category)
    );

    if (filteredPosts.length === 0) {
        alert("No posts match the selected filters!");
        return;
    }

    const workbook = XLSX.utils.book_new();
    let categorySummary = {};
    let dateSummary = {};

    filteredPosts.forEach((post) => {
        if (!categorySummary[post.category]) {
            categorySummary[post.category] = { totalPosts: 0, likes: 0, views: 0, shares: 0, reach: 0, impressions: 0 };
        }
        categorySummary[post.category].totalPosts++;
        categorySummary[post.category].likes += post.likes;
        categorySummary[post.category].views += post.views;
        categorySummary[post.category].shares += post.shares;
        categorySummary[post.category].reach += post.reach || 0;
        categorySummary[post.category].impressions += post.impressions || 0;

        if (!dateSummary[post.date]) {
            dateSummary[post.date] = { totalPosts: 0, likes: 0, views: 0, shares: 0, reach: 0, impressions: 0 };
        }
        dateSummary[post.date].totalPosts++;
        dateSummary[post.date].likes += post.likes;
        dateSummary[post.date].views += post.views;
        dateSummary[post.date].shares += post.shares;
        dateSummary[post.date].reach += post.reach || 0;
        dateSummary[post.date].impressions += post.impressions || 0;
    });

    let overviewData = Object.entries(categorySummary).map(([category, data]) => ({
        Category: category,
        "Total Posts": data.totalPosts,
        Likes: data.likes,
        Views: data.views,
        Shares: data.shares,
        Reach: data.reach,
        Impressions: data.impressions,
    }));

    // Adding Total Row
    let totalRow = overviewData.reduce(
        (acc, curr) => {
            acc["Total Posts"] += curr["Total Posts"];
            acc.Likes += curr.Likes;
            acc.Views += curr.Views;
            acc.Shares += curr.Shares;
            acc.Reach += curr.Reach;
            acc.Impressions += curr.Impressions;
            return acc;
        },
        { Category: "Total", "Total Posts": 0, Likes: 0, Views: 0, Shares: 0, Reach: 0, Impressions: 0 }
    );

    overviewData.push(totalRow);

    const overviewSheet = XLSX.utils.json_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(workbook, overviewSheet, "Overview");

    const dateSummaryData = Object.entries(dateSummary).map(([date, data]) => ({
        Date: date,
        "Total Posts": data.totalPosts,
        Likes: data.likes,
        Views: data.views,
        Shares: data.shares,
        Reach: data.reach,
        Impressions: data.impressions,
    }));

    const dateSummarySheet = XLSX.utils.json_to_sheet(dateSummaryData);
    XLSX.utils.book_append_sheet(workbook, dateSummarySheet, "Date Summary");

    // Date-wise Sheets
    selectedDates.forEach((date) => {
        let dailyPosts = filteredPosts.filter((post) => post.date === date);
        let sheetData = dailyPosts.map((post) => ({
            "Page Name": post.pageName,
            "Profile Link": post.profileLink,
            Followers: post.followerCount,
            Date: post.date,
            "Post Link": post.postLink,
            "Post Type": post.postType,
            Likes: post.likes,
            Views: post.views,
            Shares: post.shares,
            Reach: post.reach || 0,
            Impressions: post.impressions || 0,
        }));

        const dailySheet = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, dailySheet, `Date ${date}`);
    });

    // Formatting: Bold headers and borders
    const formatSheet = (sheet) => {
        const range = XLSX.utils.decode_range(sheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            let cell = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!sheet[cell]) continue;
            sheet[cell].s = {
                font: { bold: true },
                fill: { fgColor: { rgb: "FFFF00" } },
                border: {
                    top: { style: "thin", color: { auto: 1 } },
                    bottom: { style: "thin", color: { auto: 1 } },
                    left: { style: "thin", color: { auto: 1 } },
                    right: { style: "thin", color: { auto: 1 } }
                }
            };
        }
    };

    formatSheet(overviewSheet);
    formatSheet(dateSummarySheet);
    selectedDates.forEach((date) => formatSheet(workbook.Sheets[`Date ${date}`]));

    XLSX.writeFile(workbook, "SocialMediaPosts.xlsx");
};

export default ExcelExport;