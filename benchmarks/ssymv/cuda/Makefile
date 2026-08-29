CC = nvcc
BIN = bin

all: $(BIN)/alpha.ssymv $(BIN)/beta.ssymv $(BIN)/lda.ssymv $(BIN)/ssymv $(BIN)/stride.ssymv $(BIN)/uplo.ssymv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.ssymv: alpha.ssymv.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.ssymv.c -o $(BIN)/alpha.ssymv -lcublas

$(BIN)/beta.ssymv: beta.ssymv.c ../../utils/helpers.h | $(BIN)
	$(CC) beta.ssymv.c -o $(BIN)/beta.ssymv -lcublas

$(BIN)/lda.ssymv: lda.ssymv.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.ssymv.c -o $(BIN)/lda.ssymv -lcublas

$(BIN)/ssymv: ssymv.c ../../utils/helpers.h | $(BIN)
	$(CC) ssymv.c -o $(BIN)/ssymv -lcublas

$(BIN)/stride.ssymv: stride.ssymv.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.ssymv.c -o $(BIN)/stride.ssymv -lcublas

$(BIN)/uplo.ssymv: uplo.ssymv.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.ssymv.c -o $(BIN)/uplo.ssymv -lcublas

clean:
	rm -rf $(BIN)
