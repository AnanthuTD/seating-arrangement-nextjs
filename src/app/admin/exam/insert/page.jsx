"use client";

import React, { useState, useEffect } from "react";
import Select from "./select";
import axios from "@/lib/axiosPrivate";
import CourseSelect from "./courseSelect";
import CourseForm from "./courseForm";
import { Row, Col, Divider, FloatButton, message } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import DepProSemCouSelect from "../../components/depProSemCouSelect";

function Page() {
	const [departments, setDepartments] = useState([]);
	const [selectedDepartment, setSelectedDepartment] = useState(null);
	const [selectedProgram, setSelectedProgram] = useState(null);
	const [selectedSemester, setSelectedSemester] = useState(null);
	const [selectedCourse, setSelectedCourse] = useState([]);
	const [programs, setPrograms] = useState([]);
	const [semesters, setSemesters] = useState([]);
	const [reset, toggleReset] = useState(false);
	const [courseForms, setCourseForms] = useState([]);

	const handleChange = (values) => {
		const updatedCourseForms = values.courses.map((selectedCourse) => {
			const existingCourseForm = courseForms.find(
				(course) => selectedCourse.id === course.courseId,
			);

			if (existingCourseForm) {
				return existingCourseForm;
			} else {
				// Create a new form if one doesn't exist
				return {
					courseId: selectedCourse.id,
					courseName: selectedCourse.name,
					date: "",
					timeCode: "",
				};
			}
		});

		setCourseForms(updatedCourseForms);
	};

	useEffect(() => {
		if (selectedDepartment) {
			loadPrograms(selectedDepartment);
		}
	}, [selectedDepartment]);

	useEffect(() => {
		if (selectedSemester && selectedProgram) {
			loadCourses(selectedProgram, selectedSemester);
		}
	}, [selectedSemester, selectedProgram]);

	const loadDepartments = async () => {
		try {
			const result = await axios.get("/api/admin/departments");
			setDepartments(result.data);
		} catch (error) {
			console.error("Error fetching departments: ", error);
		}
	};

	const handleReset = () => {
		setDepartments([]);
		setPrograms([]);
		setCourses([]);
		setCourseForms([]);
		setSelectedCourse([]);
		setSelectedDepartment([]);
		setSelectedProgram([]);
		setSelectedSemester([]);
		setSemesters([]);
		loadDepartments();
	};

	const onFinish = async (formData) => {
		const indexToUpdate = courseForms.findIndex(
			(courseForm) => courseForm.courseId === formData.courseId,
		);

		if (indexToUpdate !== -1) {
			const updatedCourseForms = [...courseForms];
			updatedCourseForms[indexToUpdate] = formData;
			setCourseForms(updatedCourseForms);
		}

		try {
			const result = await axios.post("/api/admin/exams/timetable", formData);
			if (result.status >= 200 && result.status < 300) {
				message.success(result.data)
				return true;
			} else {
				message.error(result.data)
				return false;
			}
		} catch (error) {
			if (error.response) {
				message.error(error.response.data)
			} else if (error.request) {
				message.warning("No response received from the server.");
			} else {
				message.error("Error while making the request:", error.message);
			}
			return false;
		}
	};

	const formUpdate = async (formData) => {
		const indexToUpdate = courseForms.findIndex(
			(courseForm) => courseForm.courseId === formData.courseId,
		);

		if (indexToUpdate !== -1) {
			const updatedCourseForms = [...courseForms];
			updatedCourseForms[indexToUpdate] = formData;
			setCourseForms(updatedCourseForms);
		}
	};

	return (
		<div className="p-4 bg-white">
			<DepProSemCouSelect value={handleChange} reset={reset} />
			{courseForms.map((courseForm, index) => (
				<div key={courseForm.id}>
					<Divider />
					<Row gutter={16} justify="center" key={courseForm.id}>
						<Col span={24}>
							<CourseForm
								onFinish={onFinish}
								formData={courseForm}
								formUpdate={formUpdate}
							/>
						</Col>
					</Row>
				</div>
			))}
			<FloatButton
				onClick={() => toggleReset(!reset)}
				type="default"
				style={{
					backgroundColor: "#ffe6e6",
					border: "solid #ff8080",
				}}
				icon={<ReloadOutlined style={{ color: "#ff8080" }} />}
			/>
		</div>
	);
}

export default Page;
