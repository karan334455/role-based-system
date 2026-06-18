import { useEffect, useState } from "react";
import { getActivities } from "../../../services/activityService";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ActivityLogs() {
    const [activities, setActivities] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [dateFilter,
        setDateFilter] =
        useState("");

    const [currentPage,
        setCurrentPage] =
        useState(1);

    const itemsPerPage = 10;

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities =
        async () => {
            try {
                const { data } =
                    await getActivities();

                setActivities(
                    data.data || []
                );
            } catch (error) {
                console.log(error);
            }
        };

    const filteredActivities =
        activities.filter(
            (activity) => {
                const matchesSearch =
                    activity.action
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        ) ||
                    activity.description
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );

                const matchesDate =
                    !dateFilter ||
                    new Date(
                        activity.createdAt
                    )
                        .toISOString()
                        .split("T")[0] ===
                    dateFilter;

                return (
                    matchesSearch &&
                    matchesDate
                );
            }
        );

    const totalPages =
        Math.ceil(
            filteredActivities.length /
            itemsPerPage
        ) || 1;

    const startIndex =
        (currentPage - 1) *
        itemsPerPage;

    const paginatedActivities =
        filteredActivities.slice(
            startIndex,
            startIndex +
            itemsPerPage
        );
    const downloadCSV = () => {
        const rows = filteredActivities.map(
            (activity) => ({
                Action: activity.action,
                Description:
                    activity.description,
                Date: new Date(
                    activity.createdAt
                ).toLocaleString(),
            })
        );

        const headers = [
            "Action",
            "Description",
            "Date",
        ];

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                [
                    `"${row.Action}"`,
                    `"${row.Description}"`,
                    `"${row.Date}"`,
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;",
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download = `activity-logs-${new Date()
            .toISOString()
            .split("T")[0]}.csv`;

        link.click();

        URL.revokeObjectURL(url);
    };
    const downloadExcel = () => {
        const worksheet =
            XLSX.utils.json_to_sheet(
                filteredActivities.map(
                    (a) => ({
                        Action: a.action,
                        Description:
                            a.description,
                        Date: new Date(
                            a.createdAt
                        ).toLocaleString(),
                    })
                )
            );

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Activity Logs"
        );

        XLSX.writeFile(
            workbook,
            "activity-logs.xlsx"
        );
    };

    const downloadPDF = () => {
        const doc =
            new jsPDF();

        doc.setFontSize(18);

        doc.text(
            "Activity Logs Report",
            14,
            20
        );

        autoTable(doc, {
            startY: 30,
            head: [
                [
                    "Action",
                    "Description",
                    "Date",
                ],
            ],
            body:
                filteredActivities.map(
                    (a) => [
                        a.action,
                        a.description,
                        new Date(
                            a.createdAt
                        ).toLocaleString(),
                    ]
                ),
        });

        doc.save(
            "activity-logs.pdf"
        );
    };
    const printReport = () => {
        window.print();
    };
    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        Activity Logs
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View system activity history
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={downloadCSV}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg"
                        >
                            CSV
                        </button>

                        <button
                            onClick={downloadExcel}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
                        >
                            Excel
                        </button>

                        <button
                            onClick={downloadPDF}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                            PDF
                        </button>

                        <button
                            onClick={printReport}
                            className="bg-slate-700 text-white px-4 py-2 rounded-lg"
                        >
                            Print
                        </button>
                    </div>

                    {/* <button
                        onClick={downloadCSV}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        Download CSV
                    </button> */}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4 mb-5">
                <div className="grid md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Search action or description..."
                        value={
                            search
                        }
                        onChange={(e) => {
                            setSearch(
                                e.target.value
                            );
                            setCurrentPage(
                                1
                            );
                        }}
                        className="border rounded-lg p-3"
                    />

                    <input
                        type="date"
                        value={
                            dateFilter
                        }
                        onChange={(e) => {
                            setDateFilter(
                                e.target.value
                            );
                            setCurrentPage(
                                1
                            );
                        }}
                        className="border rounded-lg p-3"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="border-b bg-slate-50">
                            <th className="p-4 text-left">
                                Action
                            </th>

                            <th className="p-4 text-left">
                                Description
                            </th>

                            <th className="p-4 text-left">
                                Date
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedActivities.length >
                            0 ? (
                            paginatedActivities.map(
                                (
                                    activity
                                ) => (
                                    <tr
                                        key={
                                            activity._id
                                        }
                                        className="border-b"
                                    >
                                        <td className="p-4 font-medium">
                                            {
                                                activity.action
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                activity.description
                                            }
                                        </td>

                                        <td className="p-4">
                                            {new Date(
                                                activity.createdAt
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                )
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="text-center p-8 text-gray-500"
                                >
                                    No activity logs found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        disabled={
                            currentPage ===
                            1
                        }
                        onClick={() =>
                            setCurrentPage(
                                (
                                    prev
                                ) =>
                                    prev -
                                    1
                            )
                        }
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="font-medium">
                        Page{" "}
                        {
                            currentPage
                        }{" "}
                        of{" "}
                        {
                            totalPages
                        }
                    </span>

                    <button
                        disabled={
                            currentPage ===
                            totalPages
                        }
                        onClick={() =>
                            setCurrentPage(
                                (
                                    prev
                                ) =>
                                    prev +
                                    1
                            )
                        }
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}