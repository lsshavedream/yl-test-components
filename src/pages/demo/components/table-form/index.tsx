import React, {useContext, useEffect, useMemo} from "react";
import {DataManagementContext} from "@/pages/demo/context";
import {Form, Input} from "antd";

const TableForm:React.FC = () => {
  const {currentControlDataFormData,currentChildTableChooseData} = useContext(DataManagementContext);

  const {formData = []} = currentControlDataFormData;

  const [form] = Form.useForm();

  const formContent = useMemo(() => {
    return  formData.map((item: any, index:number) => {
      return (
        <Form.Item key={index} required={item.required} label={item.title} name={item.index}>
          <Input />
        </Form.Item>
      )
    })
  },[currentChildTableChooseData])

  useEffect(() => {
    form.setFieldsValue(currentChildTableChooseData)
  },[JSON.stringify(currentChildTableChooseData)])

  return (
    <div>
      <Form form={form}>
        {formContent}
      </Form>
    </div>
  )
}

export default TableForm
