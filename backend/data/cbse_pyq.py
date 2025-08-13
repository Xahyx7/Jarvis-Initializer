class CBSEPaper:
    def __init__(self):
        self.pyq_data = {
            'mathematics': {
                'class_10': {
                    '2023': ['Solve: 3x + 5 = 2x - 7', 'Find HCF of 96 and 404', 'Prove √5 is irrational', 'Find area triangle A(1,1), B(4,5), C(7,9)'],
                    '2022': ['Prove √5 is irrational', 'Find zeros polynomial x² - 2x - 8', 'Solve 2x² - 7x + 3 = 0', 'Distance between (2,3) and (4,1)']
                },
                'class_12': {
                    '2023': ['Find dy/dx if y = sin(x²)', 'Evaluate ∫(2x + 3)dx from 0 to 2', 'Find |A| if A = [[2,3],[4,5]]', 'Solve dy/dx = y/x']
                }
            },
            'physics': {
                'class_12': {
                    '2023': ['State Coulomb law', 'Define electric potential', 'What is electromagnetic induction?', 'Explain photoelectric effect']
                }
            }
        }
    
    def get_questions(self, subject, class_level, year=None):
        subject_data = self.pyq_data.get(subject, {})
        class_data = subject_data.get(f'class_{class_level}', {})
        
        if year:
            return class_data.get(str(year), [])
        else:
            all_questions = []
            for year_questions in class_data.values():
                all_questions.extend(year_questions)
            return all_questions
