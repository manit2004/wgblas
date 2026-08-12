CC = nvcc
BIN = bin

all: $(BIN)/ssyr $(BIN)/uplo.ssyr $(BIN)/lda.ssyr

$(BIN):
	mkdir -p $(BIN)

$(BIN)/ssyr: ssyr.c ../../utils/helpers.h | $(BIN)
	$(CC) ssyr.c -o $(BIN)/ssyr -lcublas

$(BIN)/uplo.ssyr: uplo.ssyr.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.ssyr.c -o $(BIN)/uplo.ssyr -lcublas

$(BIN)/lda.ssyr: lda.ssyr.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.ssyr.c -o $(BIN)/lda.ssyr -lcublas

clean:
	rm -rf $(BIN)
