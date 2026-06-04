from pathlib import Path
from typing import List,Any
from langchain_community.document_loaders import PyPDFLoader

def LoadPDF(data_dir: str)->List[Any]:
    '''Load pdf upload by user in documents form'''

    # use project root data folder 
    data_path=Path(data_dir).resolve()

    print(f"[debug] data path:{data_path}")
    documents=[]

    #loading pdf file
    pdf_file=list(data_path.glob("**/*.pdf"))
    print(f"[debug] found {len(pdf_file)} pdf file :{[str(f) for f in pdf_file]}")

    if not pdf_file:
        print("warning no pdf file found")
        return []

    for pdf_file in pdf_file:
        print(f"[debug] loading pdf :{pdf_file}")
        try:
            loader=PyPDFLoader(str(pdf_file))
            loaded=loader.load()
            print(f"[debug] loaded {len(loaded)} pdf docs from {pdf_file}")

            documents.extend(loaded)
        except Exception as e:
            print(f"[ERROR] faild to load your pdf try again {pdf_file}:{e}")
    return documents


