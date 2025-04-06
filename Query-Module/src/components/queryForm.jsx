"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUpload from "./imageUpload";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const QueryForm = ({ onSubmit, loading }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("suggestion");
  const [growthStage, setGrowthStage] = useState("1");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!text.trim()) {
      setError("Please enter a text query");
      return;
    }

    // if (!image) {
    //   setError("Please upload an image");
    //   return;
    // }

    onSubmit({
      text,
      image,
      type: selectedRoute,
      growthStage,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RadioGroup
        onValueChange={setSelectedRoute}
        defaultValue={selectedRoute}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="suggestion" id="suggestion" />
          <Label htmlFor="suggestion">Suggestion</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pest" id="pest" />
          <Label htmlFor="pest">Pest Query</Label>
        </div>
      </RadioGroup>

      <div className="space-y-2">
        <Label htmlFor="image-upload">Upload Image</Label>
        <ImageUpload onImageChange={setImage} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="text-query">Your Query</Label>
        <Textarea
          id="text-query"
          placeholder="Describe what you want to know about this image..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[120px]"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <RadioGroup
          onValueChange={setGrowthStage}
          defaultValue={growthStage}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="seeding" />
            <Label htmlFor="seeding">Seeding</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id="vegetative" />
            <Label htmlFor="vegetative">Vegetative</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="flowering" />
            <Label htmlFor="flowering">Flowering</Label>
          </div>
        </RadioGroup>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        variant="success"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
          </>
        ) : (
          "Submit Query"
        )}
      </Button>
    </form>
  );
};

export default QueryForm;
