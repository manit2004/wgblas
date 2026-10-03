CC = nvcc
BIN = bin

all: $(BIN)/alpha.dsymv $(BIN)/beta.dsymv $(BIN)/lda.dsymv $(BIN)/dsymv $(BIN)/stride.dsymv $(BIN)/uplo.dsymv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.dsymv: alpha.dsymv.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.dsymv.c -o $(BIN)/alpha.dsymv -lcublas

$(BIN)/beta.dsymv: beta.dsymv.c ../../utils/helpers.h | $(BIN)
	$(CC) beta.dsymv.c -o $(BIN)/beta.dsymv -lcublas

$(BIN)/lda.dsymv: lda.dsymv.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.dsymv.c -o $(BIN)/lda.dsymv -lcublas

$(BIN)/dsymv: dsymv.c ../../utils/helpers.h | $(BIN)
	$(CC) dsymv.c -o $(BIN)/dsymv -lcublas

$(BIN)/stride.dsymv: stride.dsymv.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.dsymv.c -o $(BIN)/stride.dsymv -lcublas

$(BIN)/uplo.dsymv: uplo.dsymv.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.dsymv.c -o $(BIN)/uplo.dsymv -lcublas

clean:
	rm -rf $(BIN)
