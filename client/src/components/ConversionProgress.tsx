import { motion } from "framer-motion";
import {
  Download,
  FileAudio,
  Languages,
  Mic2,
  Video,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { ConversionStatus } from "@shared/schema";

interface ConversionStep {
  id: ConversionStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const conversionSteps: ConversionStep[] = [
  { id: "downloading", label: "Downloading Video", icon: Download },
  { id: "extracting_audio", label: "Extracting Audio", icon: FileAudio },
  { id: "transcribing", label: "Transcribing Speech", icon: Mic2 },
  { id: "translating", label: "Translating Text", icon: Languages },
  { id: "generating_voice", label: "Generating Voice", icon: Mic2 },
  { id: "merging", label: "Merging Video", icon: Video },
];

interface ConversionProgressProps {
  status: ConversionStatus;
  progress: number;
  error?: string;
}

export function ConversionProgress({
  status,
  progress,
  error,
}: ConversionProgressProps) {
  const currentStepIndex = conversionSteps.findIndex((step) => step.id === status);
  const isCompleted = status === "completed";
  const isFailed = status === "failed";

  const getStepStatus = (stepIndex: number) => {
    if (isFailed) return stepIndex <= currentStepIndex ? "failed" : "pending";
    if (isCompleted) return "completed";
    if (stepIndex < currentStepIndex) return "completed";
    if (stepIndex === currentStepIndex) return "active";
    return "pending";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Conversion Progress</span>
          {isCompleted && (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </Badge>
          )}
          {isFailed && (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="w-3 h-3" />
              Failed
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-3">
          {conversionSteps.map((step, index) => {
            const stepStatus = getStepStatus(index);
            const StepIcon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  stepStatus === "active"
                    ? "bg-primary/10 border border-primary/20"
                    : stepStatus === "completed"
                    ? "bg-muted/50"
                    : stepStatus === "failed"
                    ? "bg-destructive/10"
                    : "opacity-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stepStatus === "active"
                      ? "bg-primary text-primary-foreground"
                      : stepStatus === "completed"
                      ? "bg-green-500 text-white"
                      : stepStatus === "failed"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stepStatus === "active" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : stepStatus === "completed" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : stepStatus === "failed" ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      stepStatus === "active"
                        ? "text-primary"
                        : stepStatus === "failed"
                        ? "text-destructive"
                        : ""
                    }`}
                  >
                    {step.label}
                  </p>
                  {stepStatus === "active" && (
                    <p className="text-xs text-muted-foreground">Processing...</p>
                  )}
                </div>
                {stepStatus === "completed" && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
              </motion.div>
            );
          })}
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">Error:</p>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
