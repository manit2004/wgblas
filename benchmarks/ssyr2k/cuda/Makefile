CC = nvcc
BIN = bin

all: $(BIN)/ssyr2k $(BIN)/trans.ssyr2k $(BIN)/lda.ssyr2k

$(BIN):
	mkdir -p $(BIN)

$(BIN)/ssyr2k: ssyr2k.c ../../utils/helpers.h | $(BIN)
	$(CC) ssyr2k.c -o $(BIN)/ssyr2k -lcublas

$(BIN)/trans.ssyr2k: trans.ssyr2k.c ../../utils/helpers.h | $(BIN)
	$(CC) trans.ssyr2k.c -o $(BIN)/trans.ssyr2k -lcublas

$(BIN)/lda.ssyr2k: lda.ssyr2k.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.ssyr2k.c -o $(BIN)/lda.ssyr2k -lcublas

clean:
	rm -rf $(BIN)
