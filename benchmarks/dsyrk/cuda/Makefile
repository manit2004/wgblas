CC = nvcc
BIN = bin

all: $(BIN)/alpha.dsyrk $(BIN)/beta.dsyrk $(BIN)/lda.dsyrk $(BIN)/ldc.dsyrk $(BIN)/dsyrk $(BIN)/trans.dsyrk $(BIN)/uplo.dsyrk

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.dsyrk: alpha.dsyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.dsyrk.c -o $(BIN)/alpha.dsyrk -lcublas

$(BIN)/beta.dsyrk: beta.dsyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) beta.dsyrk.c -o $(BIN)/beta.dsyrk -lcublas

$(BIN)/lda.dsyrk: lda.dsyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.dsyrk.c -o $(BIN)/lda.dsyrk -lcublas

$(BIN)/ldc.dsyrk: ldc.dsyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) ldc.dsyrk.c -o $(BIN)/ldc.dsyrk -lcublas

$(BIN)/dsyrk: dsyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) dsyrk.c -o $(BIN)/dsyrk -lcublas

$(BIN)/trans.dsyrk: trans.dsyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) trans.dsyrk.c -o $(BIN)/trans.dsyrk -lcublas

$(BIN)/uplo.dsyrk: uplo.dsyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.dsyrk.c -o $(BIN)/uplo.dsyrk -lcublas

clean:
	rm -rf $(BIN)
