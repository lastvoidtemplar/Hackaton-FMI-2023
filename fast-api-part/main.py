import uvicorn

if __name__ == '__main__':
    # Run development server
    uvicorn.run("server.app:app", host="127.0.0.1", port=8000, reload=True)