import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuoteInfoProps {
  builderName: string;
  jobName: string;
  onBuilderNameChange: (value: string) => void;
  onJobNameChange: (value: string) => void;
}

const QuoteInfo = ({ builderName, jobName, onBuilderNameChange, onJobNameChange }: QuoteInfoProps) => {
  return (
    <Card className="mb-6 bg-charcoal text-charcoal-foreground">
      <CardHeader>
        <CardTitle>Quote Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="builderName" className="text-charcoal-foreground">Builder Name:</Label>
          <Input
            id="builderName"
            value={builderName}
            onChange={(e) => onBuilderNameChange(e.target.value)}
            className="bg-charcoal/50 text-charcoal-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobName" className="text-charcoal-foreground">Job Name:</Label>
          <Input
            id="jobName"
            value={jobName}
            onChange={(e) => onJobNameChange(e.target.value)}
            className="bg-charcoal/50 text-charcoal-foreground"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteInfo;