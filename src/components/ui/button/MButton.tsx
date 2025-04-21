'use client';

import * as React from "react";
import { Ref } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "antd";
import { ButtonProps } from "antd/lib/button/button";
import clsx from "clsx";
import "./index.scss";

type Props = {
    link?: string;
    innerRef?: Ref<HTMLButtonElement | HTMLAnchorElement>;
} & Omit<ButtonProps, 'ref'> &
    React.RefAttributes<HTMLButtonElement | HTMLAnchorElement>;

const MButton = ({ className, link, onClick, ...props }: Props) => {
    const router = useRouter();

    const baseClass = "py-2 px-4 justify-center rounded-2xl hover:opacity-70";
    let computedClass = clsx(className, baseClass);

    if (!onClick && link) {
        onClick = () => router.push(link);
    }

    switch (props.type) {
        case "default":
            computedClass = clsx(
                computedClass,
                "hover:bg-gray-200",
                props.disabled ? "text-gray-400" : "text-gray-700"
            );
            break;

        case "link":
            computedClass = clsx(
                computedClass,
                props.disabled ? "text-blue-300" : "text-blue-600 underline"
            );
            break;

        case "primary":
            if (props.ghost) {
                computedClass = clsx(
                    computedClass,
                    props.disabled
                        ? "text-gray-400"
                        : props.danger
                            ? "text-red-600"
                            : "text-gray-900"
                );
            } else {
                computedClass = clsx(
                    computedClass,
                    "text-white",
                    props.disabled
                        ? "bg-gray-300 cursor-not-allowed"
                        : props.danger
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-black hover:bg-gray-900"
                );
            }
            break;
    }

    return <Button className={computedClass} onClick={onClick} {...props} />;
};

export default MButton;
