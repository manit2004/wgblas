CC = nvcc
BIN = bin

all: $(BIN)/alpha.dgemv $(BIN)/beta.dgemv $(BIN)/lda.dgemv $(BIN)/dgemv $(BIN)/stride.dgemv $(BIN)/trans.dgemv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.dgemv: alpha.dgemv.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.dgemv.c -o $(BIN)/alpha.dgemv -lcublas

$(BIN)/beta.dgemv: beta.dgemv.c ../../utils/helpers.h | $(BIN)
	$(CC) beta.dgemv.c -o $(BIN)/beta.dgemv -lcublas

$(BIN)/lda.dgemv: lda.dgemv.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.dgemv.c -o $(BIN)/lda.dgemv -lcublas

$(BIN)/dgemv: dgemv.c ../../utils/helpers.h | $(BIN)
	$(CC) dgemv.c -o $(BIN)/dgemv -lcublas

$(BIN)/stride.dgemv: stride.dgemv.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.dgemv.c -o $(BIN)/stride.dgemv -lcublas

$(BIN)/trans.dgemv: trans.dgemv.c ../../utils/helpers.h | $(BIN)
	$(CC) trans.dgemv.c -o $(BIN)/trans.dgemv -lcublas

clean:
	rm -rf $(BIN)
