CC = nvcc
BIN = bin

all: $(BIN)/alpha.ssyr $(BIN)/lda.ssyr $(BIN)/ssyr $(BIN)/stride.ssyr $(BIN)/uplo.ssyr

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.ssyr: alpha.ssyr.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.ssyr.c -o $(BIN)/alpha.ssyr -lcublas

$(BIN)/lda.ssyr: lda.ssyr.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.ssyr.c -o $(BIN)/lda.ssyr -lcublas

$(BIN)/ssyr: ssyr.c ../../utils/helpers.h | $(BIN)
	$(CC) ssyr.c -o $(BIN)/ssyr -lcublas

$(BIN)/stride.ssyr: stride.ssyr.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.ssyr.c -o $(BIN)/stride.ssyr -lcublas

$(BIN)/uplo.ssyr: uplo.ssyr.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.ssyr.c -o $(BIN)/uplo.ssyr -lcublas

clean:
	rm -rf $(BIN)
