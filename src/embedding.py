from typing import List, Any
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from src.pdf_loader import LoadPDF
import numpy as np


class EmbeddingPipeline:
    def __init__(self,model_name: str="all-MiniLM-L6-v2",chunk_size:int=1000,chunk_overlap:int=200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.model = SentenceTransformer(model_name)
        print(f"[INFO] Loaded embedding model: {model_name}")

    def Chunk_documents(self,documents:List[Any])->List[Any]:
        splitter=RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
        chunk=splitter.split_documents(documents)
        print(f"[INFO] Split {len(documents)} documents into {len(chunk)} chunks.")
        return chunk
    
    def embed_chunk( self, chunks:List[Any])->np.ndarray:
        texts=[chunk.page_content for chunk in chunks]
        print(f"[INFO] Generating embeddings for {len(texts)} chunks...")
        embeddings = self.model.encode(texts, show_progress_bar=True)
        print(f"[INFO] Embeddings shape: {embeddings.shape}")
        return embeddings