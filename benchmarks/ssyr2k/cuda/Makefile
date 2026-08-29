CC = nvcc
BIN = bin

all: $(BIN)/alpha.ssyr2k $(BIN)/beta.ssyr2k $(BIN)/lda.ssyr2k $(BIN)/ldb.ssyr2k $(BIN)/ldc.ssyr2k $(BIN)/ssyr2k $(BIN)/trans.ssyr2k $(BIN)/uplo.ssyr2k

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.ssyr2k: alpha.ssyr2k.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.ssyr2k.c -o $(BIN)/alpha.ssyr2k -lcublas

$(BIN)/beta.ssyr2k: beta.ssyr2k.c ../../utils/helpers.h | $(BIN)
	$(CC) beta.ssyr2k.c -o $(BIN)/beta.ssyr2k -lcublas

$(BIN)/lda.ssyr2k: lda.ssyr2k.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.ssyr2k.c -o $(BIN)/lda.ssyr2k -lcublas

$(BIN)/ldb.ssyr2k: ldb.ssyr2k.c ../../utils/helpers.h | $(BIN)
	$(CC) ldb.ssyr2k.c -o $(BIN)/ldb.ssyr2k -lcublas

$(BIN)/ldc.ssyr2k: ldc.ssyr2k.c ../../utils/helpers.h | $(BIN)
	$(CC) ldc.ssyr2k.c -o $(BIN)/ldc.ssyr2k -lcublas

$(BIN)/ssyr2k: ssyr2k.c ../../utils/helpers.h | $(BIN)
	$(CC) ssyr2k.c -o $(BIN)/ssyr2k -lcublas

$(BIN)/trans.ssyr2k: trans.ssyr2k.c ../../utils/helpers.h | $(BIN)
	$(CC) trans.ssyr2k.c -o $(BIN)/trans.ssyr2k -lcublas

$(BIN)/uplo.ssyr2k: uplo.ssyr2k.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.ssyr2k.c -o $(BIN)/uplo.ssyr2k -lcublas

clean:
	rm -rf $(BIN)
