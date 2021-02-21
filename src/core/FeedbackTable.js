import { Table, Space, Button } from "antd";
import "antd/dist/antd.css";

const { Column } = Table;

function FeedbackTable({ data, onUpdate, onDelete }) {
	return (
		<Table dataSource={data}>
			<Column title="Name" dataIndex="name" key="firstName" />
			<Column title="Content" dataIndex="content" key="content" />
			<Column title="Status" dataIndex="status" key="status" />
			<Column
				title="Action"
				key="action"
				render={(text, record) => (
					<Space size="middle">
						<Button
							type="primary"
							onClick={() => onUpdate(record.key)}
						>
							Publish
						</Button>
						<Button
							type="danger"
							onClick={() => onDelete(record.key)}
						>
							Delete
						</Button>
					</Space>
				)}
			/>
		</Table>
	);
}

export default FeedbackTable;
