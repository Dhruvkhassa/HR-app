// src/components/QuestionEditor.tsx
import { type Question, type ChoiceQuestion, type NumericQuestion, type FileUploadQuestion } from '../types/assessment';
import './QuestionEditor.css';

interface QuestionEditorProps {
  question: Question;
  onUpdate: (updatedQuestion: Question) => void;
  onDelete: (questionId: string) => void;
  index: number;
}

export function QuestionEditor({ question, onUpdate, onDelete, index }: QuestionEditorProps) {
  const isChoice = question.type === 'single-choice' || question.type === 'multi-choice';
  const isNumeric = question.type === 'numeric';
  const isFileUpload = question.type === 'file-upload';

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...question, prompt: e.target.value });
  };

  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...question, required: e.target.checked });
  };

  const handleMaxLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onUpdate({ ...question, maxLength: value });
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    if (!isChoice) return;
    const newOptions = [...(question as ChoiceQuestion).options];
    newOptions[optionIndex] = value;
    onUpdate({ ...question, options: newOptions });
  };

  const handleAddOption = () => {
    if (!isChoice) return;
    const newOptions = [...(question as ChoiceQuestion).options, `Option ${(question as ChoiceQuestion).options.length + 1}`];
    onUpdate({ ...question, options: newOptions });
  };

  const handleDeleteOption = (optionIndex: number) => {
    if (!isChoice) return;
    const newOptions = (question as ChoiceQuestion).options.filter((_, i) => i !== optionIndex);
    onUpdate({ ...question, options: newOptions });
  };

  const handleNumericChange = (field: 'min' | 'max' | 'step', value: number) => {
    if (!isNumeric) return;
    onUpdate({ ...question, [field]: value } as NumericQuestion);
  };

  const handleFileUploadChange = (field: 'acceptedTypes' | 'maxSize', value: any) => {
    if (!isFileUpload) return;
    onUpdate({ ...question, [field]: value } as FileUploadQuestion);
  };

  const handleConditionalChange = (field: 'dependsOn' | 'condition' | 'value', value: any) => {
    const currentConditional = question.conditional || { dependsOn: '', condition: 'equals', value: '' };
    onUpdate({ 
      ...question, 
      conditional: { ...currentConditional, [field]: value }
    });
  };

  return (
    <div className="question-editor-card">
      <div className="card-header">
        <span>{index + 1}. {question.type.replace('-', ' ')}</span>
        <button onClick={() => onDelete(question.id)} className="btn-delete">
          &times;
        </button>
      </div>
      <div className="form-group">
        <label>Question Prompt</label>
        <input type="text" value={question.prompt} onChange={handlePromptChange} />
      </div>

      <div className="validation-group">
        <div className="validation-control">
          <label>
            <input
              type="checkbox"
              checked={question.required || false}
              onChange={handleRequiredChange}
            />
            Required Question
          </label>
        </div>
        
        {(question.type === 'short-text' || question.type === 'long-text') && (
          <div className="validation-control">
            <label>Maximum Length</label>
            <input
              type="number"
              value={question.maxLength || ''}
              onChange={handleMaxLengthChange}
              placeholder="No limit"
              min="1"
            />
          </div>
        )}
      </div>

      {isChoice && (
        <div className="options-group">
          <label>Options</label>
          {(question as ChoiceQuestion).options.map((option, i) => (
            <div key={i} className="option-item">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(i, e.target.value)}
              />
              <button onClick={() => handleDeleteOption(i)} className="btn-delete-option">
                &ndash;
              </button>
            </div>
          ))}
          <button onClick={handleAddOption} className="btn-add-option">
            + Add Option
          </button>
        </div>
      )}

      {isNumeric && (
        <div className="numeric-group">
          <label>Numeric Range Settings</label>
          <div className="numeric-controls">
            <div className="numeric-control">
              <label>Minimum Value</label>
              <input
                type="number"
                value={(question as NumericQuestion).min || 0}
                onChange={(e) => handleNumericChange('min', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="numeric-control">
              <label>Maximum Value</label>
              <input
                type="number"
                value={(question as NumericQuestion).max || 100}
                onChange={(e) => handleNumericChange('max', parseInt(e.target.value) || 100)}
              />
            </div>
            <div className="numeric-control">
              <label>Step Size</label>
              <input
                type="number"
                value={(question as NumericQuestion).step || 1}
                onChange={(e) => handleNumericChange('step', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </div>
      )}

      {isFileUpload && (
        <div className="file-upload-group">
          <label>File Upload Settings</label>
          <div className="file-upload-controls">
            <div className="file-control">
              <label>Accepted File Types</label>
              <input
                type="text"
                value={(question as FileUploadQuestion).acceptedTypes?.join(', ') || ''}
                onChange={(e) => handleFileUploadChange('acceptedTypes', e.target.value.split(',').map(t => t.trim()))}
                placeholder=".pdf, .doc, .docx"
              />
            </div>
            <div className="file-control">
              <label>Maximum File Size (MB)</label>
              <input
                type="number"
                value={(question as FileUploadQuestion).maxSize || 5}
                onChange={(e) => handleFileUploadChange('maxSize', parseInt(e.target.value) || 5)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Conditional Logic */}
      <div className="conditional-group">
        <label>
          <input
            type="checkbox"
            checked={!!question.conditional}
            onChange={(e) => {
              if (e.target.checked) {
                onUpdate({ 
                  ...question, 
                  conditional: { dependsOn: '', condition: 'equals', value: '' }
                });
              } else {
                onUpdate({ ...question, conditional: undefined });
              }
            }}
          />
          Show this question conditionally
        </label>
        
        {question.conditional && (
          <div className="conditional-controls">
            <div className="conditional-control">
              <label>Depends on question ID</label>
              <input
                type="text"
                value={question.conditional.dependsOn}
                onChange={(e) => handleConditionalChange('dependsOn', e.target.value)}
                placeholder="Question ID"
              />
            </div>
            <div className="conditional-control">
              <label>Condition</label>
              <select
                value={question.conditional.condition}
                onChange={(e) => handleConditionalChange('condition', e.target.value)}
              >
                <option value="equals">Equals</option>
                <option value="not-equals">Not Equals</option>
                <option value="contains">Contains</option>
                <option value="greater-than">Greater Than</option>
                <option value="less-than">Less Than</option>
              </select>
            </div>
            <div className="conditional-control">
              <label>Value</label>
              <input
                type="text"
                value={question.conditional.value}
                onChange={(e) => handleConditionalChange('value', e.target.value)}
                placeholder="Value to compare"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}