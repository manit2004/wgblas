CC = nvcc
BIN = bin

all: $(BIN)/ssyr2 $(BIN)/uplo.ssyr2 $(BIN)/lda.ssyr2

$(BIN):
	mkdir -p $(BIN)

$(BIN)/ssyr2: ssyr2.c ../../utils/helpers.h | $(BIN)
	$(CC) ssyr2.c -o $(BIN)/ssyr2 -lcublas

$(BIN)/uplo.ssyr2: uplo.ssyr2.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.ssyr2.c -o $(BIN)/uplo.ssyr2 -lcublas

$(BIN)/lda.ssyr2: lda.ssyr2.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.ssyr2.c -o $(BIN)/lda.ssyr2 -lcublas

clean:
	rm -rf $(BIN)
