"use client";

import React, { useState } from "react";
import DragDrop from "./dragDrop";
import { message } from "antd";
import axios from "@/axiosInstance";
import Model from "./model";

const requiredFields = [
	{ key: "programId", value: "program id" },
	{ key: "semester", value: "semester" },
	{ key: "id", value: "register number" },
	{ key: "rollNumber", value: "roll number" },
	{ key: "name", value: "name" },
	{ key: "phone", value: "phone" },
	{ key: "email", value: "email" },
];

function Page() {
	const [data, setData] = useState([]);

	const handleSubmission = async (students) => {
		setData([])
		const missingStudents = students.filter((student) => {
			// Check if any of the required fields are missing for a student
			return !(
				student.hasOwnProperty("programId") &&
				student.hasOwnProperty("semester") &&
				student.hasOwnProperty("id") &&
				student.hasOwnProperty("rollNumber") &&
				student.hasOwnProperty("name")
			);
		});

		if (missingStudents.length > 0) {
			message.error(
				`The following fields are required (program, semester, id, rollNumber, name)`,
			);
			return;
		}

		try {
			const result = await axios.post("/api/admin/student", { students });
			if (result.status === 200) {
				message.success('successfully submitted');
				setData(result.data);
			} else message.error("Submit failed");
		} catch (error) {
			console.log(error);
			if (error.response.status === 400) {
				message.error(
					`Record with register number '${error.response.data.value}' already exists`,
				);
			} else message.error("Something went wrong");
		}
	};

	return (
		<div>
			<DragDrop
				requiredFields={requiredFields}
				records={handleSubmission}
			/>
			{data.length ? <Model data={data} setData={setData}/> : null}
		</div>
	);
}

export default Page;
