FROM python:3.9

# AUTH0
ENV DOMAIN dev-40az2ck6ofh1tcz4.us.auth0.com
ENV API_AUDIENCE https://partymanager.com/
ENV ALGORITHMS RS256
ENV ISSUER https://dev-40az2ck6ofh1tcz4.us.auth0.com/

# MONGODB
ENV MONGODB_USER mongo
ENV MONGODB_PASSWORD 2VxOzTHwBQf6o45D
ENV DATABASE_NAME Hakaton
ENV COLLECTION_NAME parties

# 
WORKDIR /code/
# Install dependencies
RUN pip install pipenv
COPY Pipfile /code/
COPY Pipfile.lock /code/
RUN pipenv install --system --dev
COPY . /code/
EXPOSE 8000
CMD ["python", "main.py"]