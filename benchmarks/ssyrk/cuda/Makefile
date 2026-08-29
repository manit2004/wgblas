CC = nvcc
BIN = bin

all: $(BIN)/alpha.ssyrk $(BIN)/beta.ssyrk $(BIN)/lda.ssyrk $(BIN)/ldc.ssyrk $(BIN)/ssyrk $(BIN)/trans.ssyrk $(BIN)/uplo.ssyrk

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.ssyrk: alpha.ssyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.ssyrk.c -o $(BIN)/alpha.ssyrk -lcublas

$(BIN)/beta.ssyrk: beta.ssyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) beta.ssyrk.c -o $(BIN)/beta.ssyrk -lcublas

$(BIN)/lda.ssyrk: lda.ssyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.ssyrk.c -o $(BIN)/lda.ssyrk -lcublas

$(BIN)/ldc.ssyrk: ldc.ssyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) ldc.ssyrk.c -o $(BIN)/ldc.ssyrk -lcublas

$(BIN)/ssyrk: ssyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) ssyrk.c -o $(BIN)/ssyrk -lcublas

$(BIN)/trans.ssyrk: trans.ssyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) trans.ssyrk.c -o $(BIN)/trans.ssyrk -lcublas

$(BIN)/uplo.ssyrk: uplo.ssyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.ssyrk.c -o $(BIN)/uplo.ssyrk -lcublas

clean:
	rm -rf $(BIN)
