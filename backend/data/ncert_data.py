class NCERTData:
    def __init__(self):
        self.subjects = {
            'mathematics': {
                'class_10': ['Real Numbers', 'Polynomials', 'Linear Equations', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Trigonometry', 'Circles', 'Areas Related to Circles', 'Surface Areas and Volumes', 'Statistics', 'Probability'],
                'class_12': ['Relations and Functions', 'Inverse Trigonometric Functions', 'Matrices', 'Determinants', 'Continuity and Differentiability', 'Application of Derivatives', 'Integrals', 'Application of Integrals', 'Differential Equations', 'Vector Algebra', 'Three Dimensional Geometry', 'Linear Programming', 'Probability']
            },
            'physics': {
                'class_11': ['Physical World', 'Units and Measurements', 'Motion in Straight Line', 'Motion in Plane', 'Laws of Motion', 'Work Energy Power', 'Gravitation', 'Oscillations', 'Waves'],
                'class_12': ['Electric Charges Fields', 'Electrostatic Potential', 'Current Electricity', 'Moving Charges Magnetism', 'Magnetism Matter', 'Electromagnetic Induction', 'Alternating Current', 'Electromagnetic Waves', 'Ray Optics', 'Wave Optics', 'Dual Nature Radiation', 'Atoms', 'Nuclei']
            },
            'chemistry': {
                'class_11': ['Basic Concepts Chemistry', 'Structure Atom', 'Classification Elements', 'Chemical Bonding', 'States Matter', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Hydrogen', 's-Block Elements', 'p-Block Elements', 'Organic Chemistry', 'Hydrocarbons'],
                'class_12': ['Solid State', 'Solutions', 'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry', 'Isolation Elements', 'p-Block Elements', 'd f Block Elements', 'Coordination Compounds', 'Haloalkanes Haloarenes', 'Alcohols Phenols Ethers', 'Aldehydes Ketones Carboxylic Acids', 'Amines', 'Biomolecules']
            },
            'biology': {
                'class_11': ['Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom', 'Morphology Flowering Plants', 'Anatomy Flowering Plants', 'Cell Unit Life', 'Biomolecules', 'Cell Cycle Division', 'Transport Plants', 'Photosynthesis', 'Respiration Plants', 'Plant Growth Development'],
                'class_12': ['Reproduction Organisms', 'Sexual Reproduction Flowering Plants', 'Human Reproduction', 'Reproductive Health', 'Inheritance Variation', 'Molecular Basis Inheritance', 'Evolution', 'Human Health Disease', 'Microbes Human Welfare', 'Biotechnology', 'Organisms Populations', 'Ecosystem', 'Biodiversity Conservation']
            }
        }
    
    def get_chapters(self, subject, class_level):
        return self.subjects.get(subject, {}).get(f'class_{class_level}', [])
