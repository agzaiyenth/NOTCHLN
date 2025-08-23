# Git Management Strategy for ML Model and API

This document explains how to properly manage the machine learning model and API code in this Git repository.

## Repository Structure

The repository contains several special directories that require careful handling:

1. **API Folder** (`/api`): Contains the Flask API for prediction services
2. **Model Folder** (`/Model`): Contains machine learning models and data files
3. **Frontend Code**: Standard Next.js code structure

## How to Handle the API Folder

The API folder contains a mix of code files (which should be committed) and large binary/runtime files (which should be excluded).

### What to Commit:

- Python source code files (\*.py)
- Documentation files (README.md, ARCHITECTURE.md)
- Configuration files (requirements.txt)
- Batch scripts (\*.bat)

### What to Exclude:

- Virtual environment (venv/)
- Python cache files (**pycache**/)
- Large model files (_.pkl, _.model)
- Log files
- Temporary files

### Instructions for Committing:

To add only the essential files:

```bash
# Add specific files
git add api/app.py api/model_predictor.py api/test_api.py
git add api/test_standalone.py api/test_model.py
git add api/requirements.txt api/README.md api/ARCHITECTURE.md
git add api/*.bat

# Or use this command to add all tracked files (respecting .gitignore)
git add api
```

## How to Handle the Model Folder

The Model folder contains large binary files that should not be committed directly to Git.

### What to Commit:

- Model metadata (small JSON or YAML files)
- Script files for training/evaluation
- Documentation files
- Directory structure (empty directories)

### What to Exclude:

- Trained model files (_.pkl, _.model)
- Large datasets
- Temporary files and logs
- Python cache files

### Instructions for Committing:

To add only the essential files:

```bash
# Add specific files if needed
git add Model/**/README.md
git add Model/**/*.py

# Or use this command to add all tracked files (respecting .gitignore)
git add Model
```

## General Advice

1. **Always check `git status` before committing** to make sure you're not accidentally adding large files
2. **Use `git add -p`** to selectively add changes
3. **Check file sizes before committing** - files over 100MB should generally not be committed
4. **Consider using Git LFS** for large binary files if absolutely necessary
