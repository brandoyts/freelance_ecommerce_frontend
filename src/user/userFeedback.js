/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { Comment, Tooltip, Avatar, Input, Form, Button } from "antd";
import moment from "moment";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { _createFeedback } from "../admin/apiAdmin";
import { getPublishedFeedback } from "../user/apiUser";

const userFeedback = () => {
	const [feedback, setFeedback] = useState([]);

	useEffect(() => {
		const fetchFeedback = async () => {
			const res = await getPublishedFeedback();
			console.log(res);
			setFeedback(res.data.result);
		};

		fetchFeedback();

		return () => {
			setFeedback([]);
		};
	}, []);

	const renderFeedback = () => {
		return feedback.map((item) => (
			<FeedbackCard
				userId={item.user._id}
				feedbackId={item._id}
				key={item._id}
				content={item.content}
				name={item.user.name}
				date={item.createdAt}
			/>
		));
	};

	return (
		<Layout
			title="Feedbacks"
			description={` Welcome to Feedback page `}
			className="container-fluid"
		>
			<div className="userFeedback">
				<div className="userFeedback__container">
					{renderFeedback()}
				</div>
				<div className="userFeedback__form">
					<FeedbackForm />
				</div>
			</div>
		</Layout>
	);
};

const FeedbackCard = ({ userId, feedbackId, name, content, date }) => {
	const auth = isAuthenticated();

	if (auth) {
		const {
			user: { _id, role },
		} = isAuthenticated();

		const renderAction = () => {
			let actions = [];

			console.log("object");

			if (role === 1 && _id === userId) {
				actions.push(
					<Link to={`/admin/adminFeedback/${feedbackId}`}>
						<span className="comment-action">Edit</span>
					</Link>
				);
			} else if (role === 0 && _id === userId) {
				actions.push(
					<Link to={`/user/userFeedback/${_id}/${feedbackId}`}>
						<span className="comment-action">Edit</span>
					</Link>
				);
			}

			return actions;
		};

		return (
			<Comment
				actions={renderAction()}
				author={name}
				avatar={<Avatar alt={name}>{name}</Avatar>}
				content={<p>{content}</p>}
				datetime={
					<Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
						<span>{moment(date).fromNow()}</span>
					</Tooltip>
				}
			/>
		);
	} else {
		return (
			<Comment
				author={name}
				avatar={<Avatar alt={name}>{name}</Avatar>}
				content={<p>{content}</p>}
				datetime={
					<Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
						<span>{moment(date).fromNow()}</span>
					</Tooltip>
				}
			/>
		);
	}
};

const FeedbackForm = () => {
	const history = useHistory();
	const [form] = Form.useForm();
	const { TextArea } = Input;

	const onReset = () => {
		form.resetFields();
	};

	const onFinish = async () => {
		if (!isAuthenticated()) {
			history.push("/signin");
			return;
		}

		const {
			token,
			user: { _id },
		} = isAuthenticated();

		try {
			let values = await form.validateFields();
			_createFeedback(token, _id, values.feedback);
			onReset();
		} catch (errInfo) {
			console.log("Error:", errInfo);
		}
	};

	return (
		<Form form={form} layout="horizontal" onFinish={onFinish}>
			<Form.Item
				name="feedback"
				label="Feedback"
				labelCol={{
					span: 6,
				}}
				wrapperCol={{
					span: 16,
				}}
			>
				<TextArea rows={6} />
			</Form.Item>

			<Form.Item
				wrapperCol={{
					span: 14,
					offset: 6,
				}}
			>
				<Button htmlType="submit" type="primary">
					Submit
				</Button>
				&nbsp;&nbsp;&nbsp;
				<Button htmlType="button" onClick={onReset}>
					Reset
				</Button>
			</Form.Item>
		</Form>
	);
};

export default userFeedback;
