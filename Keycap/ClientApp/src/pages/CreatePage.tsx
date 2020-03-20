import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Button, ButtonToolbar,
    Form, FormGroup, ControlLabel,
    FormControl, HelpBlock, Notification,
    Radio, RadioGroup, Schema, Tag, Loader,
} from "rsuite";

import { AnimatedText } from "../components/AnimatedText";

interface FormProps {
    title: string;
    label: 0 | 1 | 2; // Easy, medium, hard
    text: string;
}

const model = Schema.Model<FormProps>({
    title: Schema.Types.StringType()
        .minLength(3, "title must be between 3 and 100 characters long.")
        .maxLength(100, "title must be between 3 and 100 characters long.")
        .isRequired("title must be between 3 and 100 characters long."),
    text: Schema.Types.StringType()
        .minLength(10, "title must be between 10 and 500 characters long.")
        .maxLength(500, "title must be between 10 and 500 characters long.")
        .isRequired("title must be between 10 and 500 characters long."),
    label: Schema.Types.NumberType()
});

export const CreatePage: React.SFC = () => {
    const formElement = useRef<null | any>(null);
    const [formValue, setFormValue] = useState<FormProps>({
        title: "",
        label: 0,
        text: ""
    });
    const [isLoading, setLoading] = useState<boolean>(false);
    const [refId, setRefId] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (formElement?.current?.check()) {
            setLoading(true);

            try {
                const res = await fetch("/api/games", {
                    method: "POST",
                    mode: "same-origin",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        Title: formValue.title,
                        Label: formValue.label,
                        Text: formValue.text,
                    })
                });

                const body = await res.json();
                setRefId(body);
            } catch {
                Notification["error"]({
                    title: "Error",
                    placement: "bottomStart",
                    description: "an error has occured while sending your request."
                });
            }

            setLoading(false);
        }
    };

    return (
        <>
            <div style={{ marginTop: "50px" }}>
                <AnimatedText text="create custom game." />
            </div>

            <motion.div initial="hidden" animate="visible" transition={{ delay: 0.6 }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <Form
                    ref={formElement}
                    formValue={formValue}
                    model={model}
                    onChange={formValue => setFormValue({ ...formValue as any })}
                >
                    <FormGroup>
                        <ControlLabel>title</ControlLabel>
                        <FormControl
                            name="title"
                            style={{ backgroundColor: "transparent", color: "white" }}
                        />
                        <HelpBlock>* required</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>label</ControlLabel>
                        <FormControl
                            name="label"
                            accepter={RadioGroup}
                            inline
                        >
                            <Radio value={0}>
                                <Tag color="green">Easy</Tag>
                            </Radio>
                            <Radio value={1}>
                                <Tag color="blue">Medium</Tag>
                            </Radio>
                            <Radio value={2}>
                                <Tag color="red">Hard</Tag>
                            </Radio>
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>text</ControlLabel>
                        <FormControl
                            name="text"
                            rows={20}
                            componentClass="textarea"
                            style={{ backgroundColor: "transparent", color: "white" }}
                        />
                        <HelpBlock>* required</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ButtonToolbar>
                            <Button
                                appearance="primary"
                                type="submit"
                                onClick={handleSubmit}
                            >
                                {isLoading ? <Loader /> : "submit"}
                            </Button>

                            {refId &&
                                <Button appearance="subtle">
                                    <Link to={`/play/${refId}`}>
                                        go to game
                                    </Link>
                                </Button>
                            }
                        </ButtonToolbar>
                    </FormGroup>
                </Form>
            </motion.div>
        </>
   );
}