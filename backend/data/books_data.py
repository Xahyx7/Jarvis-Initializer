class BooksData:
    def __init__(self):
        self.books = {
            'rs_aggarwal': {
                'class_10': ['Real Numbers', 'Polynomials', 'Linear Equations', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Trigonometry', 'Circles', 'Surface Areas Volumes', 'Statistics', 'Probability'],
                'class_12': ['Relations Functions', 'Inverse Trigonometric Functions', 'Matrices', 'Determinants', 'Continuity Differentiability', 'Application Derivatives', 'Integration', 'Differential Equations', 'Vectors', '3D Geometry', 'Linear Programming', 'Probability']
            },
            'rd_sharma': {
                'class_10': ['Real Numbers', 'Polynomials', 'Linear Equations', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Trigonometry', 'Heights Distances', 'Circles', 'Areas Circles', 'Surface Areas Volumes', 'Statistics', 'Probability'],
                'class_12': ['Relations Functions', 'Inverse Trigonometric Functions', 'Matrices', 'Determinants', 'Continuity Differentiability', 'Application Derivatives', 'Integrals', 'Application Integrals', 'Differential Equations', 'Vector Algebra', 'Three Dimensional Geometry', 'Linear Programming', 'Probability']
            }
        }
    
    def get_chapters(self, book, class_level):
        return self.books.get(book, {}).get(f'class_{class_level}', [])
