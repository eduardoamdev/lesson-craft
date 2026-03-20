"use client";

import { useState } from "react";
import ActionBar from "@/components/ui/ActionBar";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Title from "@/components/ui/Title";

import { levelOptions } from "@/constants/levelOptions";
import { generateConversationLesson } from "@/api-clients/conversation-lesson/generate";

/**
 * Page component for the Conversation Activity Generator.
 * Provides a user interface for specifying conversation details to create AI-generated lessons.
 *
 * @returns {JSX.Element} The rendered generation tool page.
 */
export default function ConversationLessonGenerator() {
  const [description, setDescription] = useState("");
  const [age, setAge] = useState("");
  const [level, setLevel] = useState("A1");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await generateConversationLesson({ description, age, level });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      console.log("Generated Activity:", data.activityData);
    } catch (error) {
      console.error("Error generating conversation:", error);
      alert("Error generating conversation");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#1a1a1a] rounded-[2rem] p-10 shadow-2xl border border-white/5 mx-auto">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-4xl">💬</span>
            <Title>Conversation Activity</Title>
          </div>
          <p className="text-[#94a3b8] text-lg">
            Describe the conversation you want to generate
          </p>
        </div>

        <div className="bg-[#1c1c1c] border-l-4 border-blue-600 p-5 rounded-r-lg mb-8 shadow-md">
          <h3 className="text-blue-500 font-semibold flex items-center gap-2 mb-2 text-lg">
            <span>ℹ️</span> Disclaimer
          </h3>
          <p className="text-[#94a3b8] text-md leading-relaxed">
            We currently have only one masculine voice and one feminine voice available. We recommend generating conversations between an adult man and an adult woman.
          </p>
        </div>

        <div className="space-y-8">
          <TextArea
            label="Conversation Description"
            placeholder={`Describe the type of conversation you want to generate. Include details about:\n- Who are the speakers? (e.g., teacher-student, customer-waiter, friends)\n- What is the context? (e.g., at a restaurant, in a classroom, at the airport)\n- What topic should they discuss?\n- What level? (B1, B2, etc.)\n- Any specific situations or vocabulary you want included?`}
            value={description}
            onChange={setDescription}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Student's Age"
              placeholder="e.g. 12, 25, Adults..."
              value={age}
              onChange={setAge}
            />
            <Select
              label="English Level"
              value={level}
              onChange={setLevel}
              options={levelOptions}
            />
          </div>

          <div className="pt-4">
            <ActionBar>
              <Button href="/" variant="outline" className="flex-1" icon="←">
                Back
              </Button>
              <Button 
                variant="purple" 
                className="flex-1" 
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Conversation"}
              </Button>
            </ActionBar>
          </div>
        </div>
      </div>
    </main>
  );
}
