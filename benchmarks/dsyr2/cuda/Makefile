CC = nvcc
BIN = bin

all: $(BIN)/alpha.dsyr2 $(BIN)/lda.dsyr2 $(BIN)/dsyr2 $(BIN)/stride.dsyr2 $(BIN)/uplo.dsyr2

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.dsyr2: alpha.dsyr2.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.dsyr2.c -o $(BIN)/alpha.dsyr2 -lcublas

$(BIN)/lda.dsyr2: lda.dsyr2.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.dsyr2.c -o $(BIN)/lda.dsyr2 -lcublas

$(BIN)/dsyr2: dsyr2.c ../../utils/helpers.h | $(BIN)
	$(CC) dsyr2.c -o $(BIN)/dsyr2 -lcublas

$(BIN)/stride.dsyr2: stride.dsyr2.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.dsyr2.c -o $(BIN)/stride.dsyr2 -lcublas

$(BIN)/uplo.dsyr2: uplo.dsyr2.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.dsyr2.c -o $(BIN)/uplo.dsyr2 -lcublas

clean:
	rm -rf $(BIN)
