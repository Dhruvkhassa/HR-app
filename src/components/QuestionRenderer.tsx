import {type Question, type ChoiceQuestion, type NumericQuestion, type FileUploadQuestion } from '../types/assessment';
import './QuestionRenderer.css';

interface QuestionRendererProps {
  question: Question;
  index: number;
  // FIX: Made 'answer' and 'onAnswerChange' optional with '?'
  answer?: any;
  onAnswerChange?: (questionId: string, answer: any) => void;
  allAnswers?: Record<string, any>; // Add all answers for conditional logic
}

export function QuestionRenderer({ question, index, answer, onAnswerChange, allAnswers = {} }: QuestionRendererProps) {
  // Use a dummy function if onAnswerChange isn't provided (for preview mode)
  const handleChange = onAnswerChange ?? (() => {});

  // Check if question should be shown based on conditional logic
  const shouldShowQuestion = () => {
    if (!question.conditional) return true;
    
    const { dependsOn, condition, value } = question.conditional;
    const dependentAnswer = allAnswers[dependsOn];
    
    if (dependentAnswer === undefined || dependentAnswer === null) return false;
    
    switch (condition) {
      case 'equals':
        return dependentAnswer === value;
      case 'not-equals':
        return dependentAnswer !== value;
      case 'contains':
        return Array.isArray(dependentAnswer) 
          ? dependentAnswer.includes(value)
          : String(dependentAnswer).includes(String(value));
      case 'greater-than':
        return Number(dependentAnswer) > Number(value);
      case 'less-than':
        return Number(dependentAnswer) < Number(value);
      default:
        return true;
    }
  };

  if (!shouldShowQuestion()) {
    return null;
  }

  const renderQuestion = () => {
    switch (question.type) {
      case 'single-choice':
        const choiceQuestion = question as ChoiceQuestion;
        return (
          <div className="options-container">
            {choiceQuestion.options.map((option, i) => (
              <div key={i} className="option">
                <input
                  type="radio"
                  id={`${question.id}-${i}`}
                  name={question.id}
                  value={option}
                  checked={answer === option}
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  // Disable the input if it's just a preview
                  disabled={!onAnswerChange}
                />
                <label htmlFor={`${question.id}-${i}`}>{option}</label>
              </div>
            ))}
          </div>
        );
      case 'multi-choice':
        const multiChoiceQuestion = question as ChoiceQuestion;
        const currentAnswers = Array.isArray(answer) ? answer : [];
        const handleMultiChoiceChange = (option: string, isChecked: boolean) => {
            const newAnswers = isChecked
                ? [...currentAnswers, option]
                : currentAnswers.filter(a => a !== option);
            handleChange(question.id, newAnswers);
        };
        return (
            <div className="options-container">
                {multiChoiceQuestion.options.map((option, i) => (
                    <div key={i} className="option">
                        <input
                            type="checkbox"
                            id={`${question.id}-${i}`}
                            name={question.id}
                            value={option}
                            checked={currentAnswers.includes(option)}
                            onChange={(e) => handleMultiChoiceChange(option, e.target.checked)}
                            disabled={!onAnswerChange}
                        />
                        <label htmlFor={`${question.id}-${i}`}>{option}</label>
                    </div>
                ))}
            </div>
        );
      case 'short-text':
        return (
          <input
            type="text"
            className="text-input"
            value={answer || ''}
            onChange={(e) => handleChange(question.id, e.target.value)}
            disabled={!onAnswerChange}
          />
        );
      case 'long-text':
        return (
          <textarea
            className="text-area"
            value={answer || ''}
            onChange={(e) => handleChange(question.id, e.target.value)}
            disabled={!onAnswerChange}
          ></textarea>
        );
      case 'numeric':
        const numericQuestion = question as NumericQuestion;
        return (
          <div className="numeric-input-container">
            <input
              type="number"
              className="numeric-input"
              value={answer || ''}
              onChange={(e) => handleChange(question.id, parseFloat(e.target.value) || 0)}
              disabled={!onAnswerChange}
              min={numericQuestion.min}
              max={numericQuestion.max}
              step={numericQuestion.step}
            />
            {(numericQuestion.min !== undefined || numericQuestion.max !== undefined) && (
              <div className="numeric-range-info">
                Range: {numericQuestion.min || 'no min'} to {numericQuestion.max || 'no max'}
                {numericQuestion.step && ` (step: ${numericQuestion.step})`}
              </div>
            )}
          </div>
        );
      case 'file-upload':
        const fileUploadQuestion = question as FileUploadQuestion;
        return (
          <div className="file-upload-container">
            <input
              type="file"
              className="file-input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // In a real app, you'd upload the file and store the URL/path
                  handleChange(question.id, file.name);
                }
              }}
              disabled={!onAnswerChange}
              accept={fileUploadQuestion.acceptedTypes?.join(',')}
            />
            {fileUploadQuestion.acceptedTypes && (
              <div className="file-upload-info">
                Accepted types: {fileUploadQuestion.acceptedTypes.join(', ')}
                {fileUploadQuestion.maxSize && ` (max ${fileUploadQuestion.maxSize}MB)`}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="question-render-card">
      <label className="prompt-label">
        {index + 1}. {question.prompt}
        {question.required && <span className="required-indicator"> *</span>}
        {question.maxLength && (question.type === 'short-text' || question.type === 'long-text') && (
          <span className="max-length-indicator"> (max {question.maxLength} characters)</span>
        )}
      </label>
      {renderQuestion()}
    </div>
  );
}

