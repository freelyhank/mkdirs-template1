"use client";

import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/shared/stepper";
import React, { useState } from "react";

interface SubmitStepperProps {
  initialStep?: number;
}

export function SubmitStepper({ initialStep = 1 }: SubmitStepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const steps = [
    { title: "Details", description: "Enter product information" },
    { title: "Payment", description: "Select pricing plan" },
    { title: "Publish", description: "Publish your product" },
  ];

  return (
    <Stepper>
      {steps.map((step, index) => (
        <React.Fragment key={step.title}>
          <StepperItem step={index + 1}>
            {/* disable click on stepper trigger */}
            <StepperTrigger
              // onClick={() => setCurrentStep(index + 1)}
              active={currentStep === index + 1}
              className="cursor-default"
            >
              <StepperIndicator
                completed={currentStep > index + 1}
                active={currentStep === index + 1}
              >
                {index + 1}
              </StepperIndicator>
              <div>
                <StepperTitle>{step.title}</StepperTitle>
                {/* hidden on mobile, to make separator visible */}
                {/* <StepperDescription className='hidden lg:block'>
                                    {step.description}
                                </StepperDescription> */}
              </div>
            </StepperTrigger>
          </StepperItem>
          {index < steps.length - 1 && (
            <StepperSeparator completed={currentStep > index + 1} />
          )}
        </React.Fragment>
      ))}
    </Stepper>
  );
}
