import { AlertCircle, Info, Lightbulb } from "lucide-react";

interface AlertBoxProps {
    type: "info" | "warning" | "note";
    title: string;
    content: string;
}

export default function AlertBox({ type, title, content }: AlertBoxProps) {
    const getIcon = () => {
        switch (type) {
            case "info":
                return <Info className="h-5 w-5 text-blue-600" />;
            case "warning":
                return <AlertCircle className="h-5 w-5 text-yellow-600" />;
            case "note":
                return <Lightbulb className="h-5 w-5 text-green-600" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case "info":
                return "bg-blue-50 border-blue-200 text-blue-800";
            case "warning":
                return "bg-yellow-50 border-yellow-200 text-yellow-800";
            case "note":
                return "bg-green-50 border-green-200 text-green-800";
        }
    };

    return (
        <div className={`p-4 rounded-lg border-l-4 mb-8 ${getStyles()}`}>
            <div className="flex items-start space-x-3">
                <div className="w-5 h-5 flex items-center justify-center mt-0.5">{getIcon()}</div>
                <div>
                    <p className="text-sm m-0">
                        <strong>{title}:</strong> {content}
                    </p>
                </div>
            </div>
        </div>
    );
}
