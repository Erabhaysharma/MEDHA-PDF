from flask import Flask,render_template,request,jsonify
from src.pdf_loader import LoadPDF
from src.embedding import EmbeddingPipeline
from src.vectorstor import FaissVectorStore
from src.search import RAGSearch
import os

app=Flask(__name__)

UPLOADS="uploads"
FAISS_STORE="faiss_store"

os.makedirs(UPLOADS,exist_ok=True)
os.makedirs(FAISS_STORE, exist_ok=True)


@app.route("/")
def upload_page():
    return render_template("upload.html")

@app.route("/chat")
def chat_page():
    return render_template("chat.html")


@app.route("/upload", methods=["POST"])
def upload_pdf():
    try:
        if "pdf" not in request.files:
            return jsonify({
                "success":False,
                "message":"NO PDF File found"
            })
        pdf=request.files["pdf"]

        if pdf.filename=="":
            return jsonify({
                "success": False,
                "message": "Please select a PDF"
            })
        #save the uploaded pdf

        filepath=os.path.join(
            UPLOADS,
            pdf.filename
        )
        pdf.save(filepath)

        #load pdf 

        docs=LoadPDF(UPLOADS)
        print(f"[info] loaded{len(docs)} documents")

        #build vector store
        store=FaissVectorStore(persist_dir=FAISS_STORE)
        store.build_from_documents(docs)

        print("[info] vector store created sucessfully")

        return jsonify({
            "success": True,
            "message": "PDF processed successfully"

        })
    
    except Exception as e:
        print(f"[ERROR]: processing faild {e}")

        return jsonify({
            "success": False,
            "message": str(e)
        })


@app.route("/chat",methods=["POST"])
def chat_api():
    try:
        data=request.get_json()
        question=data.get("question")
        if not question:
            return jsonify({
                "success": False,
                "message": "Question is required"
            })
        print(
            f"[INFO] User Question: {question}"
        )
        rag_search=RAGSearch()
        answer=rag_search.search_and_summarize(query=question,top_k=3)
        return jsonify({
            "success": True,
            "answer": answer
        })
    
    except Exception as e:
        print(f"[ERROR] {e}")

        return jsonify({
            "success": False,
            "message": str(e)
        })
        
if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )









